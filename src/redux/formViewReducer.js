import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    login: false,
    signup: false,
    post: false,
    edit: { view: false, _id: null },
    overlay: false
}

export const formViewSlice = createSlice({
    name: 'formView',
    initialState,
    reducers: {
        login: (state) => {
            return { ...state, login: true, signup: false }
        },
        signup: (state) => {
            return { ...state, signup: true, login: false }
        },
        post: (state) => {
            return { ...state, post: true }
        },
        edit: (state, payload) => {
            return { ...state, edit: { view: true, _id: payload._id } }
        },
        overlay: (state) => {
            return { ...state, signup: false, login: false, post: false, edit: false }
        }
    }
})

export const { login, signup, post, edit, overlay } = formViewSlice.actions

export default formViewSlice.reducer