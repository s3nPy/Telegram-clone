import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppActions, UserActions } from '../../redux/actions'
import './ChatMenu.scss'

const ChatMenu = () => {
  const user = useSelector(state => state.user)
  const chat = useSelector(state => state.user.activatedChat)
  const visible = useSelector(state => state.app.chatmenu)
  const dispatch = useDispatch()

  const close = () => {
    dispatch(AppActions.toggleChatMenu())
  }

  const openChatContacts = () => {
    close()
    dispatch(AppActions.toggleChatContacts())
  }

  const openInviteContacts = () => {
    close()
    dispatch(AppActions.toggleInviteContacts())
  }

  const leaveChat = () => {
    close()
    dispatch(UserActions.leaveChat(chat))
  }

  const deleteChat = () => {
    close()
    dispatch(UserActions.deleteChat(chat))
  }


  if(!visible) {
    return null
  }

  return (
    <div className="chatMenu">
      <div className="backdrop" onMouseOver={close}></div>
      
      <div className="menu">
        <div className="btn" onClick={openChatContacts}>View members</div>
        {
          !chat.private ?  user.username === chat.owner.username ? 
            <>
            <div className="btn" onClick={openInviteContacts}>Invite members</div>
            <div className="btn" onClick={deleteChat}>Delete chat</div>
            </>
            :
            <div className="btn" onClick={leaveChat}>Leave chat</div>
            :
            null
        }
        
      </div>
    </div>
  )
}

export default ChatMenu