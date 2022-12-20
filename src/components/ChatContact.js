import React, { useContext } from "react"
import styles from "../styles/chatContactStyles"
import ChatContext from "./ChatContext"

const ChatContact = ({ contact }) => {

	const { selectedChat, setSelectedChat } = useContext(ChatContext)
	const { sender_id, text, reactions } = contact
	const backgroundColor = selectedChat == contact['sender_id'] ? '#e3e3e3' : 'white'

	const classes = styles()

	return (

		<div id={sender_id}
			className={classes.contact}
			onClick={() => {setSelectedChat(contact['sender_id'])}}
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