import React, { useContext } from "react";
import CardBoard from "./CardBoard";
import PostsContext from "./PostsContext";
import HandlerContext from "./HandlersContext"
import PostForm from "./PostForm"
import styles from "../styles/postsStyles"

const Posts = () => {
	const { user, formView } = useContext(PostsContext);
	const { setPosts, toggleComponent } = useContext(HandlerContext);
	const classes = styles();


	return (
		<>
			<div className={classes.posts}>

				{user.username && <button className="add-post-btn" onClick={() => toggleComponent('post')} > Add </button>}
				{user.username && formView.post &&
					<PostForm />
				}
				<CardBoard />
			</div>
		</>
	)
};

export default Posts;