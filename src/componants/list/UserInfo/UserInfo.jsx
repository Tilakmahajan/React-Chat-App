import React from 'react'
import { useUserStore } from '../../../lib/UserStore'

const UserInfo = () => {

  const {currentUser} = useUserStore()
  return (
    <>
      <div className='p-5  flex items-center content-between justify-between'>
        <div className="user  flex items-center gap-5 ">
          <img className='h-14 w-14 borber' src={currentUser.Avatar ||"Avatar.gif"} alt="" />
          <h2 className='font-bold'>{currentUser.username}</h2>
        </div>

        <div className="icons flex  gap-5 pl-2 object-cover ">
          <img className='h-8 w-8 cursor-pointer' src="Loder.gif" alt="loder" />
          <img src="" alt="" />
        </div>
      </div>
    </>
  )
}

export default UserInfo
