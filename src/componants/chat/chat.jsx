import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { doc, onSnapshot, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/ChatStore";
import { useUserStore } from "../../lib/UserStore";
import upload from "../../lib/upload";

const Chat = () => {
  
  const [chat, setChat] = useState(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setimg] = useState({
    file: null,
    url: ""
  });
  const { chatId , user ,isCurrentUserBlocked ,isReceiverBlocked } = useChatStore();
  const { currentUser} = useUserStore();

  const handleEmoji = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
    setOpen(false);
  };
  const handelImg = (e) => {
    if (e.target.files[0]) {
      setimg({
        file: e.target.files[0],
        url:URL.createObjectURL(e.target.files[0])
      });
    }
  };


  const endRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;
    const unsub = onSnapshot(
      doc(db, "chats", chatId),
      (res) => {
        if (res.exists()) {
          setChat(res.data());
        } else {
          console.warn("Chat not found.");
          setChat(null);
        }
      },
      (error) => {
        console.error("Error fetching chat:", error.message);
      }
    );
    return () => {
      unsub();
    };
  }, [chatId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  const handleSend = async () => {
    if (text.trim() === "") return;
    let imgURl= null

    try {

      if(img.file){
        imgURl = upload(img.imgURl)
      }


      const chatRef = doc(db, "chats", chatId);
      await updateDoc(chatRef, {
        messages: arrayUnion({
          text,
          createAt: new Date(),
          senderId: currentUser.id, // Replace with actual user ID
          ...(imgURl && {img: imgURl}),
        }),
      });

      const userIDs =[currentUser.id , user.id]
       userIDs.forEach( async (id)=>{

         const UserChatRef = doc(db, "userchats", id);
         const UserChatsSnapshot = await getDoc(UserChatRef)  
         
         if(UserChatsSnapshot.exists()){
           const userChatData = UserChatsSnapshot.data()
           const chatIndex= userChatData.chats.findIndex((c)=> c.chatId === chatId)
           userChatData.chats[chatIndex].lastMessage =text
           userChatData.chats[chatIndex].isSeen = id===currentUser.id ? true : false
           userChatData.chats[chatIndex].updateAt =Date.now()
           
           await updateDoc(UserChatRef ,{
             chats :userChatData.chats, 
            })
          }
        })




      setText("");
    } catch (error) {
      console.error("Error sending message:", error.message);
    }

    setimg({
      file:null,
      url:""
    })

  };

  return (
    <div className="chat flex flex-col border-l border-r">
      <div className="top border-b flex items-center justify-between p-4">
        <div className="user gap-4 items-center flex">
          <img className="h-16 w-16" src={user?.Avatar ||"Avatar.gif"} alt="User Avatar" />
          <div className="text">
            <span className="font-bold text-lg">{user?.username || 'unknown'}</span>
            <p className="font-light text-gray-900 text-sm">Lorem ipsum, dolor</p>
          </div>
        </div>
        <div className="Icons flex gap-4">
          <img className="h-10 w-10 cursor-pointer" src="call.png" alt="Call" />
          <img className="h-10 w-10 cursor-pointer" src="video.png" alt="Video Call" />
          <img className="h-10 w-10 cursor-pointer" src="info.png" alt="Info" />
        </div>
      </div>
      <div className="center p-5 flex-1 flex flex-col gap-5 scroll-container">
        {chat?.messages?.length ? (
          chat.messages.map((message, index) => (
            <div className={message.senderId === currentUser.id? "message own" : "message"} key={message?.id || index}>
              <div className="text flex flex-1 flex-col gap-1">
                {message.img && <img className="w-64 rounded-lg object-cover" src={message.img} alt="Message Attachment" />}
                <p>{message.text}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages yet.</p>
        )}
        {img.url && <div className="message own">
          <div className="texts">
            <img src={img.url} alt="" />
          </div>
        </div>}
        <div ref={endRef}></div>
      </div>
      <div className="bottom flex justify-between items-center p-5 border-t gap-5">
        <div className="icons flex gap-5">
          <label htmlFor="file">
          <img className="h-10 w-10 cursor-pointer" src="image.png" alt="Attach an image" />
          </label>
          <input type="file" id="file" style={{display:"none"}} onChange={handelImg} />
          <img className="h-10 w-10 cursor-pointer" src="camera.png" alt="Open camera" />
          <img className="h-10 w-10 cursor-pointer" src="mic.png" alt="Record a voice message" />
        </div>
        <input
          className="border-none outline-none flex p-2 items-center rounded-xl bg-blue-950 gap-4 flex-1 text-white "
          value={text}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
          type="text"
          placeholder={isCurrentUserBlocked || isReceiverBlocked ? "you cannot send a message":"Type a message..."}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="emoji relative">
          <img
            className="w-10 h-10 cursor-pointer"
            src="face.gif"
            alt="Emoji Picker"
            onClick={() => setOpen((prev) => !prev)}
          />
          {open && (
            <div className="absolute bottom-12 left-0">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
          className="send text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
