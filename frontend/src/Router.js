import React from 'react'
import { useSelector } from 'react-redux'
import MainPage from './pages/main/MainPage'
import AuthPage from './pages/auth/AuthPage'

const Router = () => {
  const token = useSelector(state => state.auth.token)


  return (
    <>
      {token ? <MainPage /> : <AuthPage />}
    </>
  )
}

export default Router
