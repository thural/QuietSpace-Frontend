import React, { useContext } from "react"
import PostsContext from "./PostsContext"
import Card from "./Card"
import styles from "../styles/cardBoardStyles"

const Chat = () => {
	const { posts: cards } = useContext(PostsContext)
	const classes = styles()

	return (
		<div className={classes.cardboard}>
			{
				cards.map((message) => (<Card key={message._id} card={message} />))
			}
		</div>
	)
}

export default Chat