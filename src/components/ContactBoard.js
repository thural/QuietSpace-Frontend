import React, { useContext } from "react"
//import PostsContext from "./PostsContext"
import ChatContact from "./ChatContact"
import styles from "../styles/contactBoardStyles"

const ContactBoard = ({ contacts }) => {

	//const { messages } = useContext(PostsContext)
	const classes = styles()

	return (
		<div className={classes.contacts}>
			{
				contacts.map((contact) => (<ChatContact key={contact._id} contact={contact} />))
			}
		</div>
	)
}

export default ContactBoard