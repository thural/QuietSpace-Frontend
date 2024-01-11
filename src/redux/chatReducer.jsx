import { createSlice } from '@reduxjs/toolkit'

export const chatSlice = createSlice({
    name: 'chats',
    initialState: [],
    reducers:{

        loadChat: (state, action) => {
            return action.payload
        },

        addMessage: (state, action) => {
            const {currentChatId, messageData} = action.payload;
            state.map(chat => {
                if (chat.id === currentChatId) chat.messages.push(messageData);
                return chat
            })
        },

        removeMessage: (state, action) => {
            const {currentChatId, deletedMessageId} = action.payload;
            state.map(chat => {
                if (chat.id === currentChatId){
                    chat.messages = chat.messages.filter( message => message.id !== deletedMessageId);
                    return chat;
                } else return chat;
            });
        },

    }
})

export const {
    loadChat,
    addMessage,
    removeMessage
} = chatSlice.actions

export default chatSlice.reducer

