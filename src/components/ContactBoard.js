import React, { useContext, useState } from "react"
import ChatContact from "./ChatContact"
import styles from "../styles/contactBoardStyles"

const ContactBoard = ({ contacts }) => {

	const [selectedChat, setSelectedChat] = useState(contacts[0]['sender_id'])

	const classes = styles()

	return (
		<div className={classes.contacts}>
			{
				contacts.map((contact) => (<ChatContact key={contact['sender_id']}
					contact={contact}
					selectedChat={selectedChat}
					setSelectedChat={setSelectedChat}
				/>))
			}
		</div>
	)
}

export default ContactBoard