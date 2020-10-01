import React from 'react'
// import { IconButton } from '@material-ui/core';
// import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Auth from '../../components/auth/Auth';
import './AuthPage.scss'

const AuthPage = () => {
  return (
    <div className="authPage">
      {/* <div className="header">
        <IconButton>
          <ArrowBackIcon />
        </IconButton>
        <span className="settings">settings</span>
      </div> */}

      <div className="body">
        <Auth />
      </div>
    </div>
  )
}

export default AuthPage
