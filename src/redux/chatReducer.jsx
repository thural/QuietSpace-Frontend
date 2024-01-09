import { createSlice } from '@reduxjs/toolkit'

export const chatSlice = createSlice({
    name: 'chat',
    initialState: {},
    reducers:{

        loadChat: (state, action) => {
            return action.payload
        },

        addMessage: (state, action) => {
            const {currentChat, messageData} = action.payload;
            state.map(chat => {
                if (chat.id === currentChat) {
                    chat.messages.push(messageData)
                }
                return chat
            })
        }

    }
})

export const {
    loadChat,
    addMessage
} = chatSlice.actions

export default chatSlice.reducer

