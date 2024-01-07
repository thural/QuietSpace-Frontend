import React, { useState } from "react"
import MessageContainer from "./MessageContainer"
import ContactContainer from "./ContactContainer"
import ChatContext from "./ChatContext"
import styles from "./styles/chatPageStyles"
import { useSelector } from 'react-redux'

const ChatPage = () => {

  const chat = useSelector(state => state.chatReducer)

  const contacts = chat.chat
  const [currentChat, setCurrentChat] = useState(contacts[0]["_id"])
  const messages = contacts.find(contact => contact._id == currentChat)['messages']
  const reversedMessages = [...messages].reverse()
  const classes = styles()
  
  return (
    <div className={classes.chat}>
      <ChatContext.Provider value={{ currentChat, setCurrentChat }} >
        <ContactContainer contacts={contacts} />
        <MessageContainer messages={reversedMessages} currentChat={currentChat}/>
      </ChatContext.Provider>
    </div>
  )
}

export default ChatPage