import React, { useEffect } from 'react'
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import useInput, { Validators } from '../../hooks/input.hook';
import { useDispatch, useSelector } from 'react-redux';
import './ContactCreator.scss'
import { AppActions, UserActions } from '../../redux/actions';

const ContactCreator = () => {
  const error = useSelector(state => state.user.error)
  const contactCreator = useSelector(state => state.app.contactcreator)
  const username = useInput('', [
    Validators.require()
  ])
  const dispatch = useDispatch()

  const hide = () => {
    dispatch(AppActions.toggleContactCreator())
  }

  useEffect( () => {
    username.changeValue(contactCreator.valueDefault)
    // eslint-disable-next-line
  }, [contactCreator.valueDefault])

  const createContact = e => {
    e.preventDefault()

    if(!username.isValid) {
      return
    }
    dispatch(UserActions.addContact(username.value))
  }

  if(!contactCreator.visible) {
    return null
  }

  return (
    <div className="contactCreator">
      <div className="backdrop" onClick={hide}></div>

      <form onSubmit={createContact} className="content">
        <div className="header">
          <p>New Contact</p>
          <div className="error">{error || ''}</div>
        </div>
        
        <div className="form-control">
          <PersonOutlineIcon />
          <input type="text" placeholder="Username" {...username.bind}/>
        </div>
        <div className="footer">
          <button 
            type="button"
            onClick={hide}
          >
            CANCEL
          </button>
          <button 
            disabled={!username.isValid}
            type="submit"
          >
            CREATE
          </button>
        </div>
      </form>
    </div>
  )
}

export default ContactCreator
