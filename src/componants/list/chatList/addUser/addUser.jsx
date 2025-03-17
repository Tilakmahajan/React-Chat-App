import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../../../../lib/firebase";
import { useUserStore } from "../../../../lib/UserStore";

const AddUser = ({ onAddUser }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "user");
      const q = query(userRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setUser({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() });
      } else {
        setUser(null);
        alert("User not found.");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!currentUser || !user) return;

    try {
      // Create a new chat document
      const chatRef = doc(collection(db, "chats"));
      await setDoc(chatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      const userChatsRef = collection(db, "userchats");

      // Add chat to both users' chat lists
      const chatData = {
        chatId: chatRef.id,
        lastMessage: "",
        receiverId: user.id,
        updateAt: Date.now(),
      };

      const currentUserChatData = {
        ...chatData,
        receiverId: currentUser.id,
      };

      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion(chatData),
      });

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion(currentUserChatData),
      });

      // Notify parent component of the new user addition
      if (onAddUser) {
        onAddUser({
          id: user.id,
          username: user.username,
          avatar: user.avatar || "Avatar.gif",
        });
      }

      // Clear user state and notify success
      setUser(null);
      alert("User added to your chat list!");
    } catch (error) {
      console.error("Error adding chat:", error);
      alert("Failed to add user. Please try again.");
    }
  };

  return (
    <div className="AddUser h-max w-max top-0 bottom-0 right-0 left-0 p-7 bg-slate-900 rounded-lg absolute m-auto">
      <form onSubmit={handleSearch} className="flex gap-5">
        <input
          className="p-5 border-none outline-none rounded-lg"
          type="text"
          name="username"
          placeholder="Username"
          required
        />
        <button
          type="submit"
          className="p-4 items-center rounded-lg border-none outline-none bg-blue-800 text-white"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {user && (
        <div className="user flex items-center justify-between mt-12">
          <div className="detail flex items-center gap-5">
            <img
              className="w-12 h-12 rounded-2xl object-cover invert"
              src={user.avatar || "Avatar.gif"}
              alt="User Avatar"
            />
            <span className="text-white">{user.username}</span>
          </div>
          <button
            onClick={handleAdd}
            className="p-4 items-center rounded-lg border-none outline-none bg-blue-800 text-white"
          >
            Add User
          </button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
