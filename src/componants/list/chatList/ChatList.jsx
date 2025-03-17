import React, { useEffect, useState, useCallback } from 'react';
import AddUser from './addUser/addUser';
import { useUserStore } from '../../../lib/UserStore';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useChatStore } from '../../../lib/ChatStore';

const ChatList = () => {
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState('');
  const [chats, setChats] = useState([]);
  const { currentUser } = useUserStore();
  const { ChangeChat } = useChatStore();

  useEffect(() => {
    if (!currentUser?.id) return;

    const unsub = onSnapshot(
      doc(db, 'userchats', currentUser.id),
      async (res) => {
        try {
          const items = res.data()?.chats || [];
          const chatPromises = items.map(async (item) => {
            const userDocRef = doc(db, 'user', item.receiverId);
            const userDocSnap = await getDoc(userDocRef);
            const user = userDocSnap.exists() ? userDocSnap.data() : null;
            return { ...item, user };
          });

          const chatData = await Promise.all(chatPromises);
          setChats(chatData.sort((a, b) => b.updateAt - a.updateAt));
        } catch (error) {
          console.error('Error fetching chats:', error);
        }
      },
      (error) => console.error('Error in onSnapshot:', error)
    );

    return () => unsub();
  }, [currentUser]);

  const handleAddUser = useCallback((newUser) => {
    setChats((prevChats) => [
      ...prevChats,
      {
        chatId: `temp-id-${newUser.id}`,
        lastMessage: '',
        receiverId: newUser.id,
        updateAt: Date.now(),
        user: newUser,
      },
    ]);
  }, []);

  const handleSelect = useCallback(
    async (chat) => {
      const updatedChats = chats.map((item) => {
        const { user, ...rest } = item;
        return rest;
      });

      const chatIndex = updatedChats.findIndex((item) => item.chatId === chat.chatId);
      if (chatIndex === -1) return;

      updatedChats[chatIndex].isSeen = true;

      try {
        await updateDoc(doc(db, 'userchats', currentUser.id), { chats: updatedChats });
        ChangeChat(chat.chatId, chat.user);
      } catch (err) {
        console.error('Error updating chat status:', err);
      }
    },
    [chats, currentUser, ChangeChat]
  );

  const filteredChats = chats.filter(
    (c) => c.user?.username?.toLowerCase().includes(input.trim().toLowerCase())
  );

  return (
    <div className="chatlist scroll-container flex-1">
      {/* Search Bar */}
      <div className="search flex items-center justify-center gap-5 ml-3">
        <div className="searchbar p-2 items-center rounded-xl bg-blue-950 gap-4 flex flex-1">
          <img className="h-5 w-5" src="search.gif" alt="search icon" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent border-none outline-none flex-1 text-white"
            type="text"
            placeholder="Search"
          />
        </div>
        <img
          onClick={() => setAddMode((prev) => !prev)}
          className="h-10 w-10 bg-blue-950 p-1 cursor-pointer rounded-xl"
          src={addMode ? 'Close.gif' : 'plus.gif'}
          alt="toggle add mode"
        />
      </div>

      {/* Chat List */}
      {filteredChats.map((chat) => {
        const isBlocked = chat.user?.blocked?.includes(currentUser.id);
        return (
          <div
            key={chat.chatId}
            style={{ backgroundColor: chat?.isSeen ? 'transparent' : '#5183fe' }}
            onClick={() => handleSelect(chat)}
            className="item flex items-center p-4 gap-5 border-b cursor-pointer"
          >
            <img
              className="h-16 w-16 object-cover rounded-full"
              src={isBlocked ? 'Avatar.gif' : chat.user?.Avatar || 'Avatar.gif'}
              alt="avatar"
            />
            <div className="text flex flex-col gap-1">
              <span className="font-medium">{isBlocked ? 'User' : chat.user?.username}</span>
              <p className="font-light text-base">{chat.lastMessage || 'No message yet'}</p>
            </div>
          </div>
        );
      })}

      {/* Add User Component */}
      {addMode && <AddUser onAddUser={handleAddUser} />}
    </div>
  );
};

export default ChatList;
