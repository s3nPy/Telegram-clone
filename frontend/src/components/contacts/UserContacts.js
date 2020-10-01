import React from 'react'
import SearchIcon from '@material-ui/icons/Search';
import { useDispatch, useSelector } from 'react-redux';
import { AppActions, UserActions } from '../../redux/actions';
import AvatarWrapper from '../avatar/AvatarWrapper';
import './UserContacts.scss'

export default function UserContacts() {
  const user = useSelector(state => state.user)
  const chats = useSelector(state => state.user.chats)
  const contacts = useSelector(state => state.user.contacts)
  const visible = useSelector(state => state.app.usercontacts)
  const dispatch = useDispatch()

  const hide = () => {
    dispatch(AppActions.toggleUserContacts())
  }

  const showContactCreator = () => {
    hide()
    dispatch(AppActions.toggleContactCreator())
  }

  const openPrivateChat = contact => {
    hide()
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
  }

  if(!visible) {
    return null
  }

  return (
    <div className="contacts">
      <div className="backdrop" onClick={hide}></div>

      <div className="content">
        <div className="header">
          <p className="title">Contacts</p>
          <div className="search">
            <SearchIcon />
            <input type="text" placeholder="Search" />
          </div>
        </div>

        <div className="body">
          {
           contacts.map( contact => 
              <div 
                onClick={() => openPrivateChat(contact)}
                key={contact._id} className="contact"
              >
                <AvatarWrapper user={contact}/>

                <div className="info">
                  <p className="username">{contact.username}</p>
                  <p className="last-seen">last seen recently</p>
                </div>
              </div>
            )
          }

          {!contacts.length ? (
            <div className="empty">
              <p>No contacts yet</p>
            </div>
          ) : ''}
        </div>

        <div className="footer">
          <button onClick={showContactCreator}>ADD CONTACT</button>
          <button onClick={hide}>CLOSE</button>
        </div>
      </div>
    </div>
  )
}
