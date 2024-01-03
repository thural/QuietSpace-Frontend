import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
    name: 'auth',
    initialState: { userId: null, token: null },

    reducers: {
        loadAuth: (state, action) => {
            const { userId, token } = action.payload;
            return action.payload;
        },
    }
})

export const { loadAuth } = authSlice.actions

export default authSlice.reducer