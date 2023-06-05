import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {username: null},

    reducers: {
        loadUser: (state, action) => {
            return action.payload.user
        },
    }
})

export const { loadUser } = userSlice.actions

export default userSlice.reducer