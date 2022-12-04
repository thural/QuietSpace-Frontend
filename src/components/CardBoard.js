import React, { useContext } from "react"
import PostsContext from "./PostsContext"
import Card from "./Card"
import styles from "../styles/cardBoardStyles"

const CardBoard = () => {
	const { posts: cards } = useContext(PostsContext)
	const classes = styles()

	return (
		<div className={classes.cardboard}>
			{
				cards.map((card) => (<Card key={card._id} card={card} />))
			}
		</div>
	)
}

export default CardBoard