import {createStore,combineReducers,applyMiddleware} from 'redux'
import LoginReducer from "./reducers/LoginReducer";
import thunk from 'redux-thunk'
const RootReducers = combineReducers({
  LoginReducer
})

export const store = createStore(RootReducers,applyMiddleware(thunk))