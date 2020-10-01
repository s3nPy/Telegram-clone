import axios from '../axios'
import { ADD_CONTACT, AUTH_ERROR, CHANGE_AVATAR, CLOSE_EVERYTHING, CREATE_CHAT, CREATE_PRIVATE_CHAT, HIDE_LOADER, INVITE_CONTACT, LEAVE_CHAT, LOGIN, 
  LOGOUT, REFRESH_CHAT, SAVE_MESSAGE, SELECT_CHAT, SET_ERROR, SHOW_LOADER, TOGGLE_CHATCONTACTS, TOGGLE_CHATCREATOR, TOGGLE_CHATMENU, TOGGLE_CONTACTCREATOR, TOGGLE_INVITECONTACTS, TOGGLE_SIDEMENU, 
  TOGGLE_THEME, 
  TOGGLE_USERCONTACTS, 
  USER_CLEAR, 
  USER_REFRESH } from './types'


export class LoaderActions {
  static show(latency=500) {
    return {type: SHOW_LOADER, payload: latency}
  }

  static hide() {
    return {type: HIDE_LOADER}
  }
}

export class AppActions {
  static toggleTheme() {
    return {type: TOGGLE_THEME}
  }

  static toggleSidemenu() {
    return {type: TOGGLE_SIDEMENU}
  }
  
  static toggleChatCreator() {
    return {type: TOGGLE_CHATCREATOR}
  }
  
  static toggleContactCreator(valueDefault='') {
    return dispatch => {
      dispatch(UserActions.setError())
      dispatch({type: TOGGLE_CONTACTCREATOR, payload: {valueDefault}})
    }
  }

  static toggleChatMenu() {
    return {type: TOGGLE_CHATMENU}
  }

  static toggleChatContacts() {
    return {type: TOGGLE_CHATCONTACTS}
  }
  
  static toggleUserContacts() {
    return {type: TOGGLE_USERCONTACTS}
  }

  static toggleInviteContacts() {
    return {type: TOGGLE_INVITECONTACTS}
  }

  static closeEverything() {
    return {type: CLOSE_EVERYTHING}
  }
}

export class UserActions {
  static clear() {
    return {type: USER_CLEAR}
  }

  static refresh() {
    return async dispatch => {
      dispatch(LoaderActions.show())
      try {
        const response = await axios.get('/user/refresh')
        dispatch({type: USER_REFRESH, payload: response.data})
      } catch (error) {
        dispatch(AuthActions.logout())
        console.log('Refresh User Error:', error);
      }
      dispatch(LoaderActions.hide())
    }
  }

  static setError(error=null) {
    return {type: SET_ERROR, payload: {error}}
  }

  static saveMessage(message) {
    return {type: SAVE_MESSAGE, payload: {message}}
  }

  static sendMessage(text, chat) {
    return async () => {
      try {
        const message = {text, chatId: chat._id}
        await axios.post('/chat/send', message)
      } catch (error) {
        // console.log('Error on Send Message:', error);
      }
    }
  }

  static addContact(username) {
    return async dispatch => {
      dispatch(LoaderActions.show())
      try {
        const response = await axios.post('/user/contact/add', {username})
        dispatch({type: ADD_CONTACT, payload: response.data})
        dispatch(AppActions.closeEverything())
      } catch (error) {
        const msg = error.response.data.error
        dispatch(UserActions.setError(msg))
      }
      dispatch(LoaderActions.hide())
    }
  }

  static createChat(chat) {
    return async dispatch => {
      dispatch(LoaderActions.show())
      try {
        const response = await axios.post('/chat/create', chat)
        dispatch({type: CREATE_CHAT, payload: response.data})
      } catch (error) {
        // console.log('Error on Create Chat:', error);
      }
      dispatch(AppActions.closeEverything())
      dispatch(LoaderActions.hide())
    }
  }

  static createPrivateChat(user) {
    return async dispatch => {
      dispatch(LoaderActions.show())
      try {
        const response = await axios.post('/chat/create/private', {
          username: user.username
        })
        dispatch({type: CREATE_PRIVATE_CHAT, payload: response.data})
      } catch (error) {
        console.log('Error on createPrivateChat:', error.response);
      }
      dispatch(AppActions.closeEverything())
      dispatch(LoaderActions.hide())
    }
  }

  static selectChat(chat) {
    return {type: SELECT_CHAT, payload: {chat}}
  }

  static inviteContacts(candidates, chat) {
    return async dispatch => {
      dispatch(LoaderActions.show())
      try {
        for(let candidate of candidates) {
          const invite = {
            username: candidate.username,
            chatId: chat._id
          }

          const response = await axios.post('/chat/invite', invite)
          dispatch({type: INVITE_CONTACT, payload: {
            user: response.data.user
          }})
        }        
      } catch (error) {
        // console.log('Error on InviteContacts:', error.response)
      }

      dispatch(AppActions.closeEverything())
      dispatch(LoaderActions.hide())
    }
  }

  static leaveChat(chat) {
    return async dispatch => {
      dispatch(LoaderActions.show())
      try {
        await axios.post('/chat/leave', {chatId: chat._id})
        dispatch({type: LEAVE_CHAT})
      } catch (error) {
        // console.log('Error on leaveChat', error.response)
      }
      dispatch(LoaderActions.hide())
    }
  }

  static refreshChat(chatId) {
    return async dispatch => {
      try {
        const response = await axios.post('/user/refresh/chat', {chatId})
        dispatch({type: REFRESH_CHAT, payload: {chat: response.data}})
      } catch (error) {
        dispatch({type: REFRESH_CHAT, payload: {chat: {
          _id: chatId,
          deleted: true
        }}})
      }
    }
  }

  static deleteChat(chat) {
    return async dispatch => {
      dispatch(LoaderActions.show())
      try {
        await axios.post('/chat/delete', {chatId: chat._id})
        // dispatch({type: DELETE_CHAT})
      } catch (error) {
        console.log('Error on deleteChat', error.response)
      }
      dispatch(LoaderActions.hide())
    }
  }

  static changeAvatar(file) {
    return async dispatch => {
      dispatch(LoaderActions.show())
      try {
        const data = new FormData()
        data.append('avatar', file, file.name)
        const response = await axios.post('/user/avatar', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        dispatch({type: CHANGE_AVATAR, payload: response.data})
      } catch (error) {
        console.log('ERROR:', error)
        console.log('ERROR response:', error.response)
      }
      dispatch(LoaderActions.hide())
    }
  }
}


// auth reducer actions
export class AuthActions {
  static _signIn(user, endpoint) {
    return async dispatch => {
      dispatch(LoaderActions.show())
      try {
        const response = await axios.post(`/auth/${endpoint}`, user)
        dispatch({type: LOGIN, payload: {
          token: response.data.token
        }})
      } catch (error) {
        if(typeof error.response?.data?.error === 'string') {
          dispatch({type: AUTH_ERROR, payload: {
            error: error.response.data.error
          }})
        }
      }
      dispatch(LoaderActions.hide())
    }  
  }
  
  static login(user) {
    return AuthActions._signIn(user, 'login')
  }
  
  static register(user) {
    return AuthActions._signIn(user, 'register')
  }
  
  static logout() {
    return dispatch => {
      dispatch({type: LOGOUT})
      dispatch(AppActions.closeEverything())
      dispatch(UserActions.clear())
    }
    
  }
}




