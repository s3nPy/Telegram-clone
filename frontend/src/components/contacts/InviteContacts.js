import React, { useState } from 'react'
import SearchIcon from '@material-ui/icons/Search';
import { useDispatch, useSelector } from 'react-redux';
import { AppActions, UserActions } from '../../redux/actions';
import AvatarWrapper from '../avatar/AvatarWrapper';
import './InviteContacts.scss'

export default function InviteContacts() {
  const [candidates, setCandidates] = useState([])
  const chat = useSelector(state => state.user.activatedChat)
  const contacts = useSelector(state => state.user.contacts)
  const visible = useSelector(state => state.app.invitecontacts)
  const dispatch = useDispatch()

  const clearCandidates = () => {
    setCandidates([])
  }

  const hide = () => {
    clearCandidates()
    dispatch(AppActions.toggleInviteContacts())
  }

  const inviteContacts = () => {
    dispatch(UserActions.inviteContacts(candidates, chat))
    clearCandidates()
  }

  const selectContact = contact => {
    setCandidates( p => {
      const isSelected = p.find(c => c.username === contact.username)
      return isSelected ? p.filter(c => c.username !== contact.username) : p.concat(contact)
    })
  }

  if(!visible) {
    return null
  }

  return (
    <div className="inviteContacts contacts">
      <div className="backdrop" onClick={hide}></div>

      <div className="content">
        <div className="header">
          <p className="title">Invite contacts</p>
          <div className="search">
            <SearchIcon />
            <input type="text" placeholder="Search" />
          </div>
        </div>

        <div className="body">
          {
           contacts
            .filter(c => !chat.members.find(m => m.username === c.username))
            .map( contact => {
              const isCanditate = candidates.find(c => c.username === contact.username)
              return (  
                <div 
                  key={contact._id} 
                  className={'contact ' + (isCanditate ? 'selected' : '')}
                  onClick={() => selectContact(contact)}
                >
                  <AvatarWrapper user={contact} />
                  <div className="info">
                    <p className="username">{contact.username}</p>
                    <p className="last-seen">last seen recently</p>
                  </div>
                </div>
              )
            })
          }

          {!contacts
            .filter(c => !chat.members.find(m => m.username === c.username))
            .length ? (
            <div className="empty">
              <p>All contacts already invited</p>
            </div>
          ) : ''}
        </div>

        <div className="footer">
          <button 
            disabled={!candidates.length}
            onClick={inviteContacts}
          >
            INVITE
          </button>
          <button onClick={hide}>CLOSE</button>
        </div>
      </div>
    </div>
  )
}
