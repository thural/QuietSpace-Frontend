import React, { useContext, useReducer, useEffect } from "react"
import PostBoard from "./PostBoard"
import MainContext from "../MainContext"
import PostForm from "./PostForm"
import EditForm from "./EditForm"
import styles from "./styles/postsStyles"

const Posts = () => {
	const { loggedUser, posts, setPosts, setFormView, formView } = useContext(MainContext)

	const classes = styles()

	return (
		<>
			<div className={classes.posts}>

				{loggedUser.username &&
					<button className="add-post-btn" onClick={() => setFormView({ formName: 'post' })}>
						Add
					</button>
				}

				{loggedUser.username && formView.post &&
					<PostForm />
				}

				{loggedUser.username && formView.edit.view &&
					<EditForm />
				}

				<PostBoard posts={posts} />

			</div>
		</>
	)
}

export default Posts