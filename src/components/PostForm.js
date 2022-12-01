import React, { useContext, useState } from "react";
import HandlerContext from "./HandlersContext"
import styles from "../styles/newPostStyles"
import Overlay from "./Overlay"

const PostForm = () => {
	const { setPosts, toggleComponent } = useContext(HandlerContext);
	const classes = styles();

	const [postData, setPostData] = useState({ message: '' })

	const handleChange = (event) => {
		const { name, value } = event.target
		setPostData({ ...postData, [name]: value });
	}

	const addPost = async (postData) => {
		try {
			await fetch('http://localhost:5000/api/messages', {
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify(postData)
			})
				.then(res => res.json(), err => console.log('error message: ', err))
				.then(response => {
					console.log('message: ', response);
					setPosts({ type: 'add', response })
				})
		} catch (err) { throw err }
	}

	return (
		<>
			<Overlay />
			<div className={classes.post}>
				<h3>Create a post</h3>
				<form onSubmit={(e) => { e.preventDefault(); addPost(postData); toggleComponent('overlay') }}>
					<input className='message input'
						type='text' name='message'
						placeholder="message" maxLength="64"
						value={postData.message} onChange={handleChange}
					></input>
					<button className="submit-btn" type='submit'> Submit </button>
				</form>
			</div>
		</>
	)
}

export default PostForm