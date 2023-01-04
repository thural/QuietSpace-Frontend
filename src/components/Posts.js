import React, { useContext, useReducer, useEffect } from "react"
import PostBoard from "./PostBoard"
import HandlerContext from "./HandlerContext"
import PostForm from "./PostForm"
import EditForm from "./EditForm"
import styles from "../styles/postsStyles"

const Posts = () => {
	const { user, posts, setPosts, setFormView, formView } = useContext(HandlerContext)

	const classes = styles()
	return (
		<>
			<div className={classes.posts}>

				{user.username &&
					<button
						className="add-post-btn" onClick={() => setFormView({ formName: 'post' })}
					>
						Add
					</button>}

				{user.username && formView.post &&
					<PostForm />
				}

				{user.username && formView.edit.view &&
					<EditForm />
				}

				<PostBoard posts={posts} />

			</div>
		</>
	)
}

export default Posts