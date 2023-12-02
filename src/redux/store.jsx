import { configureStore, combineReducers } from "@reduxjs/toolkit"
import chatReducer from "./chatReducer"
import postReducer from "./postReducer"
import userReducer from "./userReducer"
import formViewReducer from "./formViewReducer"

const reducer = combineReducers({
    chatReducer,
    postReducer,
    userReducer,
    formViewReducer
})

export const store = configureStore({
    reducer
})
