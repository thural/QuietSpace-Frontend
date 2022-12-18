import React, { useContext } from "react"
import HandlerContext from "./HandlersContext"
import PostsContext from "./PostsContext"
import styles from "../styles/chatContactStyles"

const ChatContact = ({ contact }) => {

	const { user } = useContext(PostsContext)
	const { setPosts, setFormView } = useContext(HandlerContext)
	const classes = styles()
	const { sender_id, text, reactions } = contact

	return (

		<div id={sender_id} className={classes.contact} >

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