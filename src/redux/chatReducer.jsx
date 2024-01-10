import { createSlice } from '@reduxjs/toolkit'

export const chatSlice = createSlice({
    name: 'chats',
    initialState: [],
    reducers:{

        loadChat: (state, action) => {
            console.log("chats from loadChat reducer method: ", action.payload);
            return action.payload
        },

        addMessage: (state, action) => {
            const {currentChat, messageData} = action.payload;
            state.map(chat => {
                if (chat.id === currentChat.id) chat.messages.push(messageData);
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

