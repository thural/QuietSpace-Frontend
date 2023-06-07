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

//create store using a reducer
export const store = configureStore({
    reducer
})

// //console log changes to the store
// store.subscribe(() => console.log(store.getState()))

// // dispatch action to counterStore
// store.dispatch(increment())
// store.dispatch(incrementByValue(3))