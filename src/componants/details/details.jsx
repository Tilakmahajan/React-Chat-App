import React from 'react'
import { auth, db } from '../../lib/firebase'
import { useChatStore } from '../../lib/ChatStore'
import { useUserStore } from '../../lib/UserStore'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { useCallback } from 'react'

const Details = () => {

  const { chatId ,user,isCurrentUserBlocked ,isReceiverBlocked , changeBlock ,  } = useChatStore()
  const {currentUser} = useUserStore()
  const handleBlock = useCallback(async () => {
   
    if (!user || !currentUser) return;
  
    const userDocRef = doc(db, "user", currentUser.id);
    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.error("Error updating block status:", err);
    }
  }, [user, currentUser, isReceiverBlocked, changeBlock]);
  

  return (
    <div className=' details flex-1'>
      <div className="flex items-center  flex-col pl-3 pt-2  border-b user ">
        <img className='h-16 w-16 object-cover rounded-full' src={user?.Avatar ||"Avatar.gif"} alt="avta" />
        <div className="text flex items-center flex-col">
          <span className='font-medium '>{user?.username || "Unknown"}</span>
          <p className='font-light text-base'>Lorem ipsum dolor.</p>
        </div>
      </div>
      <div className="info flex gap-2 flex-col">
        <div className="option">
        <div className="title p-2 flex justify-between items-center ">
            <span className='font-bold'>Chat setting</span>
            <img className='h-9 w-9  cursor-pointer rounded-full b bg-slate-700' src="uparrow.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title p-2 flex justify-between items-center">
            <span className='font-bold'>privacy and help</span>
            <img className='h-9 w-9  cursor-pointer rounded-full  bg-slate-700' src="uparrow.png" alt="" />
          </div>
        </div>
        <div className="option">
        <div className="title p-2 flex justify-between items-center">
            <span className='font-bold'>share photos</span>
            <img className='h-9 w-9  cursor-pointer rounded-full  bg-slate-700' src="downarrow.png" alt="" />
          </div>
          <div className="photos mt-5 flex flex-col gap-5">
            <div className="photoItem flex items-center justify-between mr-1">
              <div className="photoDetail flex items-center gap-5 ">
                <img className='w-10 h-10 ml-1 object-cover rounded-md' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK5CqiQQDLVEVd_mEtfKpqF8MTZj0SqiEEWg&s" alt="" />
                <span className='text-gray-950 text-sm font-light'>photo name</span>
              </div>
              <img className='h-8 w-8 mr-1  cursor-pointer rounded-full ' src="download.png" alt="" />
            </div>
            <div className="photoItem flex items-center justify-between mr-1">
              <div className="photoDetail flex items-center gap-5 ">
                <img className='w-10 h-10 ml-1 object-cover rounded-md' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK5CqiQQDLVEVd_mEtfKpqF8MTZj0SqiEEWg&s" alt="" />
                <span className='text-gray-950 text-sm font-light'>photo name</span>
              </div>
              <img className='h-8 w-8 mr-1  cursor-pointer rounded-full ' src="download.png" alt="" />
            </div>
            <div className="photoItem flex items-center justify-between mr-1">
              <div className="photoDetail flex items-center gap-5 ">
                <img className='w-10 h-10 ml-1 object-cover rounded-md' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK5CqiQQDLVEVd_mEtfKpqF8MTZj0SqiEEWg&s" alt="" />
                <span className='text-gray-950 text-sm font-light'>photo name</span>
              </div>
              <img className='h-8 w-8 mr-1  cursor-pointer rounded-full ' src="download.png" alt="" />
            </div>
            <div className="photoItem flex items-center justify-between mr-1">
              <div className="photoDetail flex items-center gap-5 ">
                <img className='w-10 h-10 ml-1 object-cover rounded-md' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK5CqiQQDLVEVd_mEtfKpqF8MTZj0SqiEEWg&s" alt="" />
                <span className='text-gray-950 text-sm font-light'>photo name</span>
              </div>
              <img className='h-8 w-8 mr-1  cursor-pointer rounded-full ' src="download.png" alt="" />
            </div>
          </div>
        </div>
        <div className="option">
        <div className="title p-2 flex justify-between items-center">
            <span className='font-bold'>Shared file</span>
            <img className='h-9 w-9  cursor-pointer rounded-full  bg-slate-700' src="uparrow.png" alt="" />
          </div>
        </div>
        <div className='flex flex-col justify-center items-center gap-2'>
        <button onClick={handleBlock} className='bg-red-600 w-60 rounded-2xl cursor-pointer p-1 hover:bg-red-800'>{
      isCurrentUserBlocked?"you are blocked" : isReceiverBlocked?"User blocked" : "Block User"
      }</button>
        <button className='bg-gray-900 w-60 text-white rounded-2xl cursor-pointer  p-1 hover:bg-gray-950'onClick={()=>auth.signOut()}>Logout</button>
        </div>
      </div>
    </div>
  )
}

export default Details
