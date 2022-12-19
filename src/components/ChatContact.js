import React, { useContext } from "react"
import ChatContext from "./ChatContext"
import styles from "../styles/chatContactStyles"

const ChatContact = ({ contact, selectedChat, setSelectedChat }) => {

	const { setMessages, chat } = useContext(ChatContext)
	const { sender_id, text, reactions } = contact
	const backgroundColor = selectedChat == contact['sender_id'] ? '#e3e3e3' : 'white'

	const classes = styles()

	return (

		<div id={sender_id}
			className={classes.contact}

			onClick={
				() => {
					setSelectedChat(contact['sender_id']);
					setMessages({ type: 'load', sender_id, chat });
				}}

			style={{ backgroundColor }}
		>

			<div className={classes.author}>
				{sender_id}
			</div>

			<div className={classes.text}>
				<p>{text}</p>
			</div>

		</div>
	)
}

export default ChatContact