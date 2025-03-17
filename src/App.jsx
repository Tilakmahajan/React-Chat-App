
import { useEffect } from 'react';
import './App.css';
import Chat1 from './componants/chat/chat';
import Details1 from './componants/details/details';
import List1 from './componants/list/list';
import Login from './componants/login/login';
import Notification from './componants/notification/notification';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useUserStore } from './lib/UserStore';
import { useChatStore } from './lib/ChatStore';

function App() {
  const {currentUser ,isLoading ,fetchUserInfo } = useUserStore()
  const {chatId, ChangeChat } = useChatStore()

  useEffect(() => {
    const unSub = onAuthStateChanged(auth ,(user)=>{
      fetchUserInfo(user?.uid)
    })
  
    return () => {
      unSub()
    }
  }, [fetchUserInfo])
 
  
  if(isLoading) return <div className='p-12 text-3xl rounded-lg text-white bg-slate-950'>Loading...</div>


  return (
    <div className='containe '>
      {currentUser ? (
        <>
          <List1 />
         { chatId && <Chat1 />}
        { chatId &&  <Details1 />}
        </>
      ) :(
        <Login />
      )
      }
      <Notification/>

    </div>

  );
}

export default App;
