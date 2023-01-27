import React, { useState, useContext } from "react"
import ChatBoard from "./ChatBoard"
import ContactBoard from "./ContactBoard"
import ChatContext from "./ChatContext"
import HandlerContext from "./HandlerContext"
import styles from "../styles/chatStyles"

const Chat = () => {
	const { chat, setChat } = useContext(HandlerContext)

	const contacts = chat['chat'].map(contact => contact._id)
	//const contacts = chat.chat.map(contact => contact.messages.findLast(message => message.user_id !== user.username))

	const [currentChat, setCurrentChat] = useState(contacts[0])

	const messages = chat['chat'].find(contact => contact._id == currentChat).messages

	const classes = styles()
	return (
		<div className={classes.chat}>

			<ChatContext.Provider value={{ chat, setChat, currentChat, setCurrentChat }} >
				<ContactBoard contacts={contacts} />
				<ChatBoard messages={messages} />
			</ChatContext.Provider>

		</div>
	)
}

export default Chat