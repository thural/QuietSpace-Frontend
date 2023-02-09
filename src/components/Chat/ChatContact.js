import React, { useContext } from "react"
import styles from "./styles/chatContactStyles"
import ChatContext from "./ChatContext"
import MainContext from "../MainContext"

const ChatContact = ({ contact }) => {
	const { loggedUser } = useContext(MainContext);
	const { currentChat, setCurrentChat } = useContext(ChatContext)
	const backgroundColor = currentChat == contact['_id'] ? '#e3e3e3' : 'white'

	const contactName = contact.messages.findLast(message => message.username != loggedUser.username).username
	const recentText = contact.messages[contact.messages.length - 1].text

	const classes = styles()

	return (

		<div id={contactName}
			className={classes.contact}
			onClick={() => {setCurrentChat(contact['_id'])}}
			style={{ backgroundColor }}
		>

			<div className={classes.author}>
				{contactName}
			</div>

			<div className={classes.text}>
				<p>{recentText}</p>
			</div>

		</div>
	)
}

export default ChatContact