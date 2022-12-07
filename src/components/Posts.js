import React, { useContext } from "react"
import CardBoard from "./CardBoard"
import PostsContext from "./PostsContext"
import HandlerContext from "./HandlersContext"
import PostForm from "./PostForm"
import EditForm from "./EditForm"
import styles from "../styles/postsStyles"

const Posts = () => {
	const { user, formView } = useContext(PostsContext)
	const { setPosts, setFormView } = useContext(HandlerContext)
	const classes = styles()


	return (
		<>
			<div className={classes.posts}>

				{user.username &&
					<button className="add-post-btn" onClick={() => setFormView({formName:'post'})} >
						Add
					</button>}

				{user.username && formView.post &&
					<PostForm />
				}

				{user.username && formView.edit.view &&
					<EditForm />
				}

				<CardBoard />

			</div>
		</>
	)
};

export default Posts