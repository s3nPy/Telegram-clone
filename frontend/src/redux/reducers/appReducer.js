import { CLOSE_EVERYTHING, TOGGLE_INVITECONTACTS, TOGGLE_CHATCONTACTS, TOGGLE_CHATCREATOR, TOGGLE_CHATMENU, TOGGLE_CONTACTCREATOR, TOGGLE_SIDEMENU, TOGGLE_USERCONTACTS, TOGGLE_THEME } from "../types"

const initialState = {
  darktheme: true,

  sidemenu: false,
  chatcreator: false,
  contactcreator: {
    visible: false,
    valueDefault: ''
  },
  chatmenu: false,
  chatcontacts: false,
  usercontacts: false,
  invitecontacts: false
}

export const appReducer = (state = initialState, action) => {
  switch(action.type) {
    case TOGGLE_THEME:
      return {...state, darktheme: !state.darktheme}
    case TOGGLE_SIDEMENU:
      return {...state, sidemenu: !state.sidemenu}
    case TOGGLE_CHATCREATOR:
      return {...state, chatcreator: !state.chatcreator}
    case TOGGLE_CONTACTCREATOR:
      return {...state, contactcreator: {
        visible: !state.contactcreator.visible,
        valueDefault: action.payload.valueDefault
      }}
    case TOGGLE_CHATMENU:
      return {...state, chatmenu: !state.chatmenu}
    case TOGGLE_CHATCONTACTS:
      return {...state, chatcontacts: !state.chatcontacts}
    case TOGGLE_USERCONTACTS:
      return {...state, usercontacts: !state.usercontacts}
    case TOGGLE_INVITECONTACTS:
      return {...state, invitecontacts: !state.invitecontacts}
    case CLOSE_EVERYTHING:
      return initialState
    default: return state
  }
}