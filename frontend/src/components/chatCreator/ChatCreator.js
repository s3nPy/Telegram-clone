import React from 'react'
import { Avatar } from '@material-ui/core'
import useInput, { Validators } from '../../hooks/input.hook'
import { useDispatch, useSelector } from 'react-redux'
import './ChatCreator.scss'
import { AppActions, UserActions } from '../../redux/actions'

const ChatCreator = () => {
  const visible = useSelector(state => state.app.chatcreator)
  const dispatch = useDispatch()
  
  const title = useInput('', [ 
    Validators.require(),
    Validators.length({min: 3, max: 24})
  ])
  const description = useInput()


  const close = e => {
    e.preventDefault()
    dispatch(AppActions.toggleChatCreator())
  }

  const create = e => {
    e.preventDefault()

    if(!title.value.trim() || !title.isValid){
      title.focus()
      return
    }

    const chat = {
      title: title.value,
      description: description.value
    }
    dispatch(UserActions.createChat(chat))
  }

  if(!visible) {
    return null
  }

  return (
    <div className='chatCreator'>
      <div className="backdrop" onClick={close}></div>

      <form onSubmit={create} className="modal">
        <div className="header">
          <Avatar />
          <input 
            type="text" 
            placeholder="Chat Title" 
            {...title.bind}
          />
        </div>
        
        <input 
          type="text" 
          placeholder="Description (optional)" 
          {...description.bind}
        />

        <div className="buttons">
          <button 
            type="button"
            onClick={close}
          >
            cancel
          </button>
          <button
            type="submit"
            disabled={!title.isValid} 
          >
            create
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatCreator
