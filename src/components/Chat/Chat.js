import React, { useState } from "react"
import ChatBoard from "./ChatBoard"
import ContactBoard from "./ContactBoard"
import ChatContext from "./ChatContext"
import styles from "./styles/chatStyles"
import { useSelector } from 'react-redux'

const Chat = () => {

  const chat = useSelector(state => state.chatReducer)

  const contacts = chat.chat
  const [currentChat, setCurrentChat] = useState(contacts[0]["_id"])
  const messages = chat.chat.find(contact => contact._id == currentChat).messages
  const reversedMessages = [...messages].reverse()
  const classes = styles()
  
  return (
    <div className={classes.chat}>
      <ChatContext.Provider value={{ currentChat, setCurrentChat }} >
        <ContactBoard contacts={contacts} />
        <ChatBoard messages={reversedMessages} currentChat={currentChat}/>
      </ChatContext.Provider>
    </div>
  )
}

export default Chat