import Card from "./Card"
import styles from "../styles/cardBoardStyles"
import React from "react"

const CardBoard = ({posts}) => {
	const classes = styles()

	return (
		<div className={classes.cardboard}>
			{
				posts.map((card) => (<Card key={card._id} card={card} />))
			}
		</div>
	)
}

export default CardBoard