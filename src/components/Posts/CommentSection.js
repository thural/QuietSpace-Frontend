import React, { useContext, useState } from "react"
import MainContext from "../MainContext"
import styles from "./styles/commentStyles"

const CommentSection = ({ _id, comments }) => {

	const { setPosts, setFormView, loggedUser } = useContext(MainContext);

	const [commentData, setCommentData] = useState({ text: '' })


	const handleChange = (event) => {
		const { name, value } = event.target
		setCommentData({ ...commentData, [name]: value })
	}


	const addComment = async (commentData, _id) => {
		try {
			await fetch(`http://localhost:5000/api/posts/${_id}/comments`, {
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify(commentData)
			})
				.then(res => res.json(), err => console.log('error from add post: ', err))
				.then(data => {
					setPosts({ type: 'add', data })
				})
		} catch (err) { throw err }
	}


	const classes = styles()

	return (

		<div className={classes.commentSection} >

			<form
				onSubmit={(e) => {
					e.preventDefault();
					addComment(commentData, _id);
					setFormView({ formName: 'overlay' })
				}}
			>

				<textarea className={classes.commentInput}
					type='text'
					name='text'
					placeholder="Write a comment ..." maxLength="128"
					value={commentData.text} onChange={handleChange}>
				</textarea>

				<button className="submit-btn" type='submit'> add </button>

			</form>

			{comments &&
				comments.map(comment => (
					<div key={comments.indexOf(comment)} className={classes.comment}>

						<p className="comment-author">{comment.username}</p>

						<p className="comment-text">{comment.text}</p>

						<div className="comment-options">
							<p className="comment-like">like</p>
							<p className="comment-reply">reply</p>
							{comment.username == loggedUser.username && <p className="comment-delete">delete</p>}
						</div>
						
					</div>
				))
			}

		</div>
	)

}

export default CommentSection