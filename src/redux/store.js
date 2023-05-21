import { configureStore } from "@reduxjs/toolkit"

// import a reducer
import { allReducers } from './reducers'

//create store using a reducer
export const store = configureStore({ reducer: allReducers })

// //console log changes to the store
// store.subscribe(() => console.log(store.getState()))

// // dispatch action to counterStore
// store.dispatch(increment())
// store.dispatch(incrementByValue(3))