import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MenuIcon from '@material-ui/icons/Menu';
import { IconButton } from '@material-ui/core';
import { AppActions, UserActions } from '../../redux/actions'
import './Sidebar.scss'
import AvatarWrapper from '../avatar/AvatarWrapper';

const Sidebar = () => {
  const dispatch = useDispatch()
  const username = useSelector(state => state.user.username)
  const chats = useSelector(state => state.user.chats)
  const activatedChat = useSelector(state => state.user.activatedChat)

  const openSidemenu = () => {  
    dispatch(AppActions.toggleSidemenu())
  }

  const selectChat = (chat) => {
    dispatch(UserActions.selectChat(chat))
  }

  return (
    <div className="sidebar">
      <div className="header">
        <IconButton onClick={openSidemenu}>
          <MenuIcon />
        </IconButton>
        <input type="text" placeholder="Search"/>
      </div>

      <div className="body">
        {
          chats.map( chat => 
            <div 
              className={'tab ' + (chat._id === activatedChat?._id ? 'selected': '')} 
              key={chat._id} 
              onClick={() => selectChat(chat)}
            >
              <AvatarWrapper chat={chat}/>

              <div className="content">
                <div className="row">
                  <p className="title">
                    {
                      chat.private ? 
                      chat.members.find(m => m.username !== username).username : 
                      chat.title
                    }
                  </p>
                  <p className="timestamp">
                    {chat.messages.slice(-1)[0] ?
                      new Date(chat.messages.slice(-1)[0]?.timestamp)
                      .toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                  </p>
                </div>
                <div className="row">
                  <p className="message">{chat.messages.slice(-1)[0]?.text || ''}</p>
                  {chat.unread && <span className="new-messages">{chat.unread}</span>}
                </div>
              </div>
            </div> 
          )
        }
         
      </div>
    </div>
  )
}

export default Sidebar