import React, { useContext } from "react"
import styles from "../styles/chatContactStyles"
import ChatContext from "./ChatContext"

const ChatContact = ({ contact }) => {

	const { currentChat, setCurrentChat } = useContext(ChatContext)
	const { username, text, reactions } = contact
	const backgroundColor = currentChat == contact['user_id'] ? '#e3e3e3' : 'white'

	console.log("contact from ChatCOntact", contact)

	const classes = styles()

	return (

		<div id={username}
			className={classes.contact}
			onClick={() => {setCurrentChat(contact['_id'])}}
			style={{ backgroundColor }}
		>

			<div className={classes.author}>
				{username}
			</div>

			<div className={classes.text}>
				<p>{text}</p>
			</div>

		</div>
	)
}

export default ChatContact