import React, { useContext } from "react"
import PostsContext from "./PostsContext"
import Message from "./Message"
import styles from "../styles/cardBoardStyles"

const Chat = () => {
	const { posts: cards } = useContext(PostsContext)
	const classes = styles()

	return (
		<div className={classes.cardboard}>
			{
				cards.map((message) => (<Message key={message._id} content={message} />))
			}
		</div>
	)
}

export default Chat