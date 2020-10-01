import { combineReducers } from 'redux'
import { appReducer } from './reducers/appReducer';
import { authReducer } from "./reducers/authReducer";
import { loaderReducer } from './reducers/loaderReducer'
import { userReducer } from './reducers/userReducer';

export const rootReducer = combineReducers({
  auth: authReducer,
  loader: loaderReducer,
  app: appReducer,
  user: userReducer
})