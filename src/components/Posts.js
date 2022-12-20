import React, { useContext, useReducer, useEffect } from "react"
import CardBoard from "./CardBoard"
import HandlerContext from "./HandlerContext"
import PostForm from "./PostForm"
import EditForm from "./EditForm"
import styles from "../styles/postsStyles"

const deletePost = async (_id) => {
	try {
		await fetch(`http://localhost:5000/api/messages/delete/${_id}`, { method: 'POST' })
		return true
	} catch (err) { return false }
}

function postReducer(state, { posts, data, user, _id, type }) {
	switch (type) {
		case 'like':
			return state.map(post => {
				if (post['_id'] == _id) {
					if (post.likes.includes(user['id'])) return post
					const postLikes = [...post.likes, user['_id']]
					return { ...post, likes: postLikes }
				}
				return post
			})
		case 'unlike':
			return state.map(post => {
				if (post['_id'] == _id) {
					const reducedLikes = post.likes.filter(likeId => likeId !== user['_id'])
					return { ...post, likes: reducedLikes }
				}
				return post
			})
		case 'delete':
			deletePost(_id)
			return state.filter(post => post['_id'] !== _id)
		case 'add':
			const newState = [data, ...state]
			//console.log('data after "add" reducer: ', data)
			return newState // TODO: first figure out the response and then get back here.
		case 'edit':
			return state.map(message => message['_id'] == _id ? data : message)
		case 'load':
			return posts
		default: return state
	}
}

const Posts = () => {
	const { user, setFormView, formView } = useContext(HandlerContext)
	const classes = styles()


	const fetchPosts = async () => {
		const data = await fetch('http://localhost:5000/api/messages')
		const items = await data.json()
		setPosts({ posts: items.messages, type: 'load' })
	}

	const [posts, setPosts] = useReducer(postReducer, []);

	useEffect(() => { fetchPosts() }, []);


	return (
		<>
			<div className={classes.posts}>

				{user.username &&
					<button className="add-post-btn" onClick={() => setFormView({ formName: 'post' })} >
						Add
					</button>}

				{user.username && formView.post &&
					<PostForm />
				}

				{user.username && formView.edit.view &&
					<EditForm />
				}

				<CardBoard posts={posts} />

			</div>
		</>
	)
};

export default Posts