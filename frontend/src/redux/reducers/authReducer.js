import { AUTH_ERROR, LOGIN, LOGOUT } from "../types"

const initialState = {
  token: localStorage.getItem('token'),
  error: null
}

export const authReducer = (state = initialState, action) => {
  switch(action.type) {
    case LOGIN: 
      localStorage.setItem('token', action.payload.token)
      return {...state, ...action.payload}
      
    case AUTH_ERROR:
      return {...state, error: action.payload.error}

    case LOGOUT: {
      localStorage.clear()
      return {token: null, error: null}
    }
    default: return state
  }
} 