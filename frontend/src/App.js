import React, { useEffect } from 'react';
import Loader from './components/loader/Loader';
import Router from './Router';
import { useDispatch, useSelector } from 'react-redux';
import { UserActions } from './redux/actions';
import io from 'socket.io-client'
import './App.scss';

function App() {
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const darktheme = useSelector(state => state.app.darktheme)

  useEffect( () => {
    if(token){
      dispatch(UserActions.refresh())
    }
  }, [dispatch, token])


  useEffect( () => {
    const socket = io('http://localhost:9000/')
    if(token) {
      socket.emit('authentication', token)
      socket.on('message', msg => {
        dispatch(UserActions.saveMessage(msg))
      })

      socket.on('chat_force_refresh', chatId => {
        dispatch(UserActions.refreshChat(chatId))
      })

      socket.on('chat_deleted', chatId => {
        dispatch(UserActions.refreshChat(chatId))
      })
    }

    return () => socket.disconnect()
  }, [dispatch, token])

  return (
    <div className="container">
      <div className={"app " + (!darktheme && 'dark')}>
        <Loader />
        <Router />
      </div>
    </div>
  )
}

export default App;
