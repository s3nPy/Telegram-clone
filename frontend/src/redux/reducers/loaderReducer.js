import { HIDE_LOADER, SHOW_LOADER } from "../types"

const initialState = {
  visible: false,
  latency: 500
}

export const loaderReducer = (state = initialState, action) => {
  switch(action.type) {
    case SHOW_LOADER:
      return {...state, visible: true, latency: action.payload}
    case HIDE_LOADER:
      return {...state, visible: false}
    default: return state
  }
} 