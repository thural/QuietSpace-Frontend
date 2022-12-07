import React, { useContext, useState } from "react"
import HandlerContext from "./HandlersContext"
import styles from "../styles/newPostStyles"
import PostsContext from "./PostsContext"
import Overlay from "./Overlay"

const PostForm = () => {

	const classes = styles()
	const { user, posts, formView } = useContext(PostsContext)
	const { setPosts, setFormView } = useContext(HandlerContext)

	const _id = formView.edit["_id"]

	//console.log("edit formView ID: ", _id)

	const message = posts.find( post => post["_id"] == _id)["message"]

	const [postData, setPostData] = useState({ "message": message })

	const handleChange = (event) => {
		const { name, value } = event.target
		setPostData({ ...postData, [name]: value })
	}

	const addPost = async (postData, _id) => {
		try {
			await fetch(`http://localhost:5000/api/messages/edit/${_id}`, {
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify(postData)
			})
				.then(res => res.json(), err => console.log('error message from edit POST: ', err))
				.then(data => {
					console.log('Edited Message: ', data)
					setPosts({ type: 'edit', data, _id })
				})
		} catch (err) { throw err }
	}

	return (
		<>
			<Overlay />
			<div className={classes.post}>
				<h3>Edit post</h3>
				<form onSubmit={(e) => { e.preventDefault(); addPost(postData, _id); setFormView({ formName: 'overlay' }) }}>

					<input
						className='message input'
						type='text'
						name='message'
						placeholder="message"
						maxLength="64"
						value={postData["message"]}
						onChange={handleChange}>
					</input>

					<button className="submit-btn" type='submit'> Submit </button>

				</form>
			</div>
		</>
	)
}

export default PostForm