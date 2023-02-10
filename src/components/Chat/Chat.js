import React, { useState, useContext } from "react"
import ChatBoard from "./ChatBoard"
import ContactBoard from "./ContactBoard"
import ChatContext from "./ChatContext"
import MainContext from "../MainContext"
import styles from "./styles/chatStyles"

const Chat = () => {

	const { chat, setChat } = useContext(MainContext)
	
	const contacts = chat

	const [currentChat, setCurrentChat] = useState(contacts[0]["_id"])

	const messages = chat.find(contact => contact._id == currentChat).messages

	const reversedMessages = [...messages].reverse()

	const classes = styles()
	
	return (
		<div className={classes.chat}>

			<ChatContext.Provider value={{ chat, setChat, currentChat, setCurrentChat }} >
				<ContactBoard contacts={contacts} />
				<ChatBoard messages={reversedMessages} />
			</ChatContext.Provider>

		</div>
	)

}

export default Chat