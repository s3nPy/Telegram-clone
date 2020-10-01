import cloneDeep from 'lodash/cloneDeep'
import { ADD_CONTACT, CHANGE_AVATAR, CREATE_CHAT, CREATE_PRIVATE_CHAT, INVITE_CONTACT, LEAVE_CHAT, REFRESH_CHAT, SAVE_MESSAGE, SELECT_CHAT, SET_ERROR, USER_CLEAR, USER_REFRESH } from "../types"

const initialState = {
  username: 'Username',
  chats: [],
  contacts: [],
  
  activatedChat: null,
  error: null
}

// this class is needed in order to delete
// blob which is has no reference anymore
const avatar = new class {
  refs = new Map()

  _generateUrl(data) {
    const blob = new Blob(
      [new Uint8Array(data)], 
      {type: 'image/png'}
    )
    return URL.createObjectURL(blob)
  }

  _createRef(id, url) {
    const ref = this.refs.get(id) || {}
    ref.url = url
    this.refs.set(id, ref)     
    return ref
  }

  _revokeRef(id) {
    if( !this.refs.has(id) ) return

    URL.revokeObjectURL( this.refs.get(id).url )
  }

  init(user) {
    if(!user || !user.avatar) return
    
    if(this.refs.has(user._id)) {
      user.avatar.ref = this.refs.get(user._id)
    } else {
      const url = this._generateUrl(user.avatar.data)
      user.avatar.ref = this._createRef(user._id, url)
    }
    
    user.avatar.data = undefined
  }

  update(user) {
    if(!user || !user.avatar) return
    
    this._revokeRef(user._id)
    const url = this._generateUrl(user.avatar.data)
    user.avatar.ref = this._createRef(user._id, url)

    user.avatar.data = undefined
  }
} ()


const handler = {
  [USER_REFRESH]: (state, action) => {
    const nextState = cloneDeep({...state, ...action.payload})
    avatar.init(nextState)
    nextState.contacts.forEach(contact => avatar.init(contact))
    nextState.chats.forEach(chat => {
      chat.members.forEach(member => avatar.init(member))
      chat.messages.forEach(message => avatar.init(message.author))
    })

    console.log('avatars: ', Array.from(avatar.refs.keys()).length)

    return nextState
  },

  [CREATE_CHAT]: (state, action) => {
    const chat = action.payload.chat
    return {
      ...state, 
      chats: state.chats.concat(chat),
      activatedChat: chat
    }
  },

  [CREATE_PRIVATE_CHAT]: (state, action) => {
    const chat = action.payload.chat
    return {
      ...state,
      chats: state.chats.concat(chat),
      activatedChat: chat
    }
  },

  [SAVE_MESSAGE]: (state, action) => {
    const message = action.payload.message
    avatar.init(message.author)
    
    const idx = state.chats.findIndex(chat => chat._id === message.chat)
    if(idx >= 0){
      const clone = cloneDeep(state)
      clone.chats[idx].messages.push(message)
      if(clone.activatedChat?._id !== message.chat) {
        clone.chats[idx].unread = (clone.chats[idx].unread + 1) || 1 
      }
      return clone
    }
    return state
  },

  [SELECT_CHAT]: (state, action) => {
    // slow place but easy code with cloneDeep
    const clone = cloneDeep(state)
    clone.activatedChat = clone.chats.filter(
      chat => chat._id === action.payload.chat._id)[0]
    clone.activatedChat.unread = null
    return clone
  },

  [SET_ERROR]: (state, action) => {
    return {...state, error: action.payload.error}
  },

  [ADD_CONTACT]: (state, action) => {
    const contact = action.payload.contact
    avatar.init(contact)
    return {
      ...state, 
      contacts: state.contacts.concat(contact)
    }
  },

  [INVITE_CONTACT]: (state, action) => {
    const clone = cloneDeep(state)
    clone.activatedChat.members.push(action.payload.user)
    return clone
  },

  [LEAVE_CHAT]: (state) => {
    const id = state.activatedChat?._id.toString()
    return id ? {
      chats: state.chats.filter(c => c._id.toString() !== id),
      activatedChat: null
    } : state
  },

  [REFRESH_CHAT]: (state, action) => {
    const chat = action.payload.chat
    const chatIndex = state.chats.findIndex(c => c._id.toString() === chat._id.toString())

    if(chat.deleted) {
      if(chatIndex >= 0) {
        const chats = state.chats.slice()
        chats.splice(chatIndex, 1)
        return {...state, chats, activatedChat: null} 
      }
      return state
    }

    chat.members.forEach(member => avatar.init(member))
    chat.messages.forEach(message => avatar.init(message.author))

    if(chatIndex >= 0) {
      const chats = state.chats.slice()
      chats.splice(chatIndex, 1, chat)

      const activatedChat = (
        chat._id.toString() === state.activatedChat._id.toString() ? 
        chat : state.activatedChat
      )

      return {...state, chats, activatedChat }
    } else {
      return {...state, chats: state.chats.concat({
          ...chat, unread: chat.messages.length
        })
      }
    }
  },

  [CHANGE_AVATAR]: (state, action) => {
    const fakeUser = {
      _id: state._id,
      avatar: action.payload.avatar
    }
    avatar.update(fakeUser)
    return {...state, ...fakeUser}
  },

  [USER_CLEAR]: () => initialState
}

export const userReducer = (state = initialState, action) => {
  const handle = handler[action.type]
  return handle ? handle(state, action) : state
}