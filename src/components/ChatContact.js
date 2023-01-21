import React, { useContext } from "react"
import styles from "../styles/chatContactStyles"
import ChatContext from "./ChatContext"

const ChatContact = ({ contact }) => {

	const { currentChat, setCurrentChat } = useContext(ChatContext)
	const { user_id, text, reactions } = contact
	const backgroundColor = currentChat == contact['user_id'] ? '#e3e3e3' : 'white'

	const classes = styles()

	return (

		<div id={user_id}
			className={classes.contact}
			onClick={() => {setCurrentChat(contact['user_id'])}}
			style={{ backgroundColor }}
		>

			<div className={classes.author}>
				{user_id}
			</div>

			<div className={classes.text}>
				<p>{text}</p>
			</div>

		</div>
	)
}

export default ChatContact