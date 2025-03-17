import { createUserWithEmailAndPassword ,signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { auth } from '../../lib/firebase';
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../lib/firebase';
import upload from '../../lib/upload';

const Login = () => {
  const [avtar, setAvtar] = useState({
    file: null,
    url: ''
  });
  const [loading, setLoading] = useState(false)

  const handelLogin =async e=>{
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.target)
    const { password ,email} =Object.fromEntries(formData)
    


    try {
     await signInWithEmailAndPassword(auth,email,password)
    } catch (err) {
      console.log(err)
      toast.error(err.message)
      
    }finally{
      setLoading(false)
    }
  }
  const handelRegesiter = async (e)=>{
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.target)
    const { username ,password ,email} =Object.fromEntries(formData)
    

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password)
      // const imgUrl = await upload(avtar.file)
      await setDoc(doc(db, "user", res.user.uid), {
       username,
       email,
      id: res.user.uid,
      blocked :[],
      });
      await setDoc(doc(db, "userchats", res.user.uid), {
      chats:[],
      });

      toast.success("Account Created!! you can login now")
      
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    }finally{
      setLoading(false)
    }
  
  }

  const handelavatar = (e) => {
    if (e.target.files[0]) {
      setAvtar({
        file: e.target.files[0],
        url:URL.createObjectURL(e.target.files[0])
      });
    }
  };

  return (
    <div className='login flex flex-col lg:flex-row  md:flex-row  flex-1  items-center  lg:gap-24 w-full  lg:h-full'>
      <div className="item flex items-center gap-2 lg:gap-5 flex-col flex-1 mt-9">
        <h1 className='font-bold text-xl'>Welcome Back</h1>
        <form onSubmit={handelLogin} className='flex flex-col items-center justify-center gap-5'>
          <input className='text-white p-5 border-none outline-none bg-slate-950 rounded-lg' type="text" placeholder='Email' name='email' />
          <input className='text-white p-5 border-none outline-none bg-slate-950 rounded-lg' type="password" placeholder='Password' name='password' />
          <button  disabled={loading} className=' cursor-pointer rounded-lg bg-blue-700 p-3 border-none w-full text-gray-300 font-bold text-lg disabled:cursor-none disabled:bg-blue-950'>{loading? "Loading" : "Sign In"}</button>
          </form>
      </div>
   <div className= 'separator lg:bg-gray-800 lg:h-[90%]'>.</div>
        <div className="item flex items-center gap-1 lg:gap-5  flex-col flex-1">
          <h1 className='font-bold text-xl'>Create an account</h1> 
          <form onSubmit={handelRegesiter} className='flex flex-col items-center justify-center gap-2 mb-5  lg:gap-5'>
            <label className='flex items-center gap-4' htmlFor="file">
            <img className='w-12 h-12 rounded-lg object-cover' src={avtar.url || "Avatar.gif"} alt="Avatar Preview" />Upload a file</label>
            <input 
              style={{ display: "none" }}
              onChange={handelavatar}
              type="file"
              id="file"
            />
            <input className='text-white p-5 border-none outline-none bg-slate-950 rounded-lg' type="text" placeholder='Username' name='username' />
            <input className='text-white p-5 border-none outline-none bg-slate-950 rounded-lg' type="text" placeholder='Email' name='email' />
            <input className='text-white p-5 border-none outline-none bg-slate-950 rounded-lg' type="password" placeholder='Password' name='password' />
            <button disabled={loading}  className='cursor-pointer rounded-lg bg-blue-700 p-3 border-none w-full text-gray-300 font-bold text-lg disabled:cursor-none disabled:bg-blue-950'>{loading? "Loading" : "Sign Up"}</button>
          </form>
        </div>
    
      <div className="item"></div>
    </div>
  );
}

export default Login;
