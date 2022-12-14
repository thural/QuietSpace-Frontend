import React, { useContext } from "react"
//import PostsContext from "./PostsContext"
import Message from "./Message"
import styles from "../styles/chatBoardStyles"

const ChatBoard = ({ messages }) => {

	//const { messages } = useContext(PostsContext)
	const classes = styles()

	return (
		<div className={classes.chatboard}>
			{
				messages.map((message) => (<Message key={message._id} message={message} />))
			}
		</div>
	)
}

export default ChatBoard