import Post from "./Post"
import styles from "../styles/cardBoardStyles"
import React from "react"

const CardBoard = ({posts}) => {
	const classes = styles()

	return (
		<div className={classes.cardboard}>
			{
				posts.map((post) => (<Post key={post._id} card={post} />))
			}
		</div>
	)
}

export default CardBoard