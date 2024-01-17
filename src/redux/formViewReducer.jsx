import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    auth: true,
    login: false,
    signup: false,
    post: false,
    edit: {view: false, id: null},
    overlay: false
}

export const formViewSlice = createSlice({
    name: 'formView',
    initialState,
    reducers: {
        login: (state) => {
            return {...state, login: true, signup: false}
        },
        signup: (state) => {
            return {...state, signup: true, login: false}
        },
        authenticate:(state) => {
            state.auth = false;
        },
        post: (state) => {
            return {...state, post: true}
        },
        edit: (state, action) => {
            const [view, id] = action.payload;
            return {...state, edit: {view, id}}
        },
        overlay: (state) => {
            return {...state, auth: true, signup: false, login: false, post: false, edit: false}
        }
    }
})

export const {
    login,
    signup,
    post,
    edit,
    authenticate,
    overlay
} = formViewSlice.actions

export default formViewSlice.reducer