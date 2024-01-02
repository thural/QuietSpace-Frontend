import { configureStore, combineReducers } from "@reduxjs/toolkit"
import chatReducer from "./chatReducer"
import postReducer from "./postReducer"
import userReducer from "./userReducer"
import authReducer from "./authReducer"
import formViewReducer from "./formViewReducer"

const reducer = combineReducers({
    chatReducer,
    postReducer,
    userReducer,
    authReducer,
    formViewReducer
})

export const store = configureStore({
    reducer
})
