import React from 'react'
import SearchIcon from '@material-ui/icons/Search';
import { useDispatch, useSelector } from 'react-redux';
import { AppActions, UserActions } from '../../redux/actions';
import AvatarWrapper from '../avatar/AvatarWrapper';
import './ChatContacts.scss'

export default function ChatContacts() {
  const user = useSelector(state => state.user)
  const chats = useSelector(state => state.user.chats)
  const chat = useSelector(state => state.user.activatedChat)
  const visible = useSelector(state => state.app.chatcontacts)
  const dispatch = useDispatch()

  const hide = () => {
    dispatch(AppActions.toggleChatContacts())
  }

  const addContact = contact => {
    if( contact.username === user.username ) {
      return
    }
    
    hide()

    if(user.contacts.filter(c => c._id === contact._id).length) {
      const chat = chats.find(chat => {
        const isIncluded = [user.username, contact.username].every(username => {
          return chat.members.find(member => member.username === username)
        })
        return isIncluded && chat.private
      })
  
      if(chat) {
        dispatch(UserActions.selectChat(chat))
      } else {
        dispatch(UserActions.createPrivateChat(contact))
      }

      return
    }

    dispatch(AppActions.toggleContactCreator(contact.username))
  }

  if(!visible || !chat) {
    return null
  }

  return (
    <div className="contacts">
      <div className="backdrop" onClick={hide}></div>

      <div className="content">
        <div className="header">
          <p className="title">Members</p>
          <div className="search">
            <SearchIcon />
            <input type="text" placeholder="Search" />
          </div>
        </div>

        <div className="body">
          {
           chat.members.map( member => 
              <div 
                key={member._id} 
                className="contact"
                onClick={() => addContact(member)}
              >
                <AvatarWrapper user={member} />
                <div className="info">
                  <p className="username">{member.username}</p>
                  <p className="last-seen">
                    {member._id === chat.owner._id ? 'owner' : 'member'}
                  </p>
                </div>
              </div>
            )
          }
        </div>

        <div className="footer">
          <button onClick={hide}>CLOSE</button>
        </div>
      </div>
    </div>
  )
}
