import React, { useContext, useState } from "react"
import ChatContact from "./ChatContact"
import styles from "../styles/contactBoardStyles"

const ContactBoard = ({ contacts }) => {

	const classes = styles()

	return (
		<div className={classes.contacts}>
			{
				contacts.map((contact) => (<ChatContact key={contact.user_id} contact={contact}/>))
			}
		</div>
	)
}

export default ContactBoard