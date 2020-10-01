import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChatOutlinedIcon from '@material-ui/icons/ChatOutlined';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import NightsStayOutlinedIcon from '@material-ui/icons/NightsStayOutlined';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import ToggleOnIcon from '@material-ui/icons/ToggleOn';
import ToggleOffIcon from '@material-ui/icons/ToggleOff';
import AvatarWrapper from '../avatar/AvatarWrapper'
import { AppActions, AuthActions, UserActions } from '../../redux/actions';
import './Sidemenu.scss'

const Sidemenu = () => {
  const [display, setDisplay] = useState(false)
  const visible = useSelector(state => state.app.sidemenu)
  const user = useSelector(state => state.user)
  const darktheme = useSelector(state => state.app.darktheme)
  const dispatch = useDispatch()

  useEffect( () => {
    if(visible) {
      setDisplay(true)
    } else {
      setTimeout(() => {
        setDisplay(false)
      }, 250)
    }
  }, [visible])


  const close = () => {
    dispatch(AppActions.toggleSidemenu())
  }

  const showChatCreator = () => {
    close()
    dispatch(AppActions.toggleChatCreator())
  }

  const showUserContacts = () => {
    close()
    dispatch(AppActions.toggleUserContacts())
  }

  const updateAvatar = e => {
    const file = e.target.files[0]
    if(file){
      dispatch(UserActions.changeAvatar(file))
    }
  }

  const toggleTheme = () => {
    dispatch(AppActions.toggleTheme())
  }

  const logout = () => {
    dispatch(AuthActions.logout())
  }
    

  if(!display && !visible) {
    return null
  }

  return (
    <div className={"sidemenu" + (visible && display ? ' show' : '')}>
      <div className="backdrop" onClick={close}></div>
      <div className="menu">
        <div className="header">
          <div className="top">
            <form action="/profle" encType="multipart/form-data">
              <label htmlFor="fileElem">
                <AvatarWrapper user={user} />
              </label>
              <input 
                id="fileElem" 
                type="file" 
                name="avatar" 
                accept=".png, .jpg, .jpeg"
                onChange={updateAvatar}
              />
            </form>
            
            <BookmarkBorderOutlinedIcon />
          </div>
          <div className="bottom">
            <div className="left">
              <p className="username">{user.username}</p>
              <p className="phone">+8 987 654 32 10</p>
            </div>
            <ExpandMoreIcon />
          </div>
        </div>

        <div className="body">
          <div className="content">
            <div className="button" onClick={showChatCreator}>
              <ChatOutlinedIcon />
              <p>New Chat</p>
            </div>
            <div className="button" onClick={showUserContacts}>
              <PersonOutlineOutlinedIcon />
              <p>Contacts</p>
            </div>
            <div className="button" onClick={logout}>
              <ExitToAppOutlinedIcon />
              <p>Logout</p>
            </div>
            <div className="button">
              <NightsStayOutlinedIcon />
              <div className="toggle" onClick={toggleTheme}>
                <p>Night Mode</p>
                {darktheme ? <ToggleOnIcon /> : <ToggleOffIcon />}
              </div>
            </div>
            
            
          </div>
          <div className="footer">
            <a href="https://github.com/s3nPy/Telegram-clone">Telegram Clone</a>
            <a href="https://github.com/s3nPy/Telegram-clone">Version 1.0.0 - About</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidemenu
