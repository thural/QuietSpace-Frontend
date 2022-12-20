import React, { useContext } from "react"
import HandlerContext from "./HandlerContext"
import styles from "../styles/messageStyles"

const Message = ({ message }) => {

	const { user } = useContext(HandlerContext)
	const { sender_id, text, reactions } = message
	const liked = reactions.includes(user['_id']) ? 'unlike' : 'like'
	const margin = message.sender_id !== user.username ? "auto" : "0"

	const classes = styles()

	return (

		<div id={sender_id} className={classes.message} style={{marginLeft:margin}}>

			<div className={classes.sender}>
				{sender_id}
			</div>

			<div className={classes.text}>
				<p>{text}</p>
			</div>

		</div>
	)
}

export default Message