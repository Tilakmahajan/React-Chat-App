import React from 'react'
import UserInfo from './UserInfo/UserInfo'
import ChatList from './chatList/ChatList'

const list = () => {
  return (
    <div className='list flex-1 flex-col flex  '>
    <UserInfo/>
    <ChatList/>
    </div>
  )
}

export default list
