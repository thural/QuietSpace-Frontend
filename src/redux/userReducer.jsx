import {createSlice} from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {id: null, role: null, username: null, email: null},

    reducers: {
        loadUser: (state, action) => {
            return action.payload
        },
    }
})

export const {loadUser} = userSlice.actions

export default userSlice.reducer