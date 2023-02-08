import Post from "./Post"
import styles from "./styles/cardBoardStyles"
import React from "react"

const PostBoard = ({posts}) => {
	const classes = styles()

	return (
		<div className={classes.cardboard}>
			{
				posts.map((post) => (<Post key={post._id} post={post} />))
			}
		</div>
	)
}

export default PostBoard