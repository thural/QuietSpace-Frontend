import { createSlice } from '@reduxjs/toolkit'

export const chatSlice = createSlice({
    name: 'chat',
    initialState: {},
    reducers:{
        loadChat: (state, action) => {
            const {chatData} = action.payload
            return chatData
        },
        addMessage: (state, action) => {
            const {currentChat, messageData} = action.payload;
            state.chat.map(contact => {
                if (contact['_id'] == currentChat) {
                    contact.messages.push(messageData)
                }
                return contact
            })
        }
    }
})

export const {loadChat, addMessage} = chatSlice.actions

export default chatSlice.reducer

