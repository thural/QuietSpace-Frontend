import React, { useContext, useState } from "react"
import HandlerContext from "./HandlerContext"
import styles from "../styles/commentStyles"

const CommentSection = (postid, comments) => {
	const { setPosts, setFormView } = useContext(HandlerContext);

	const [commentData, setCommentData] = useState({ text: '' })

	const handleChange = (event) => {
		const { name, value } = event.target
		setCommentData({ ...commentData, [name]: value });
	}

	const addComment = async (commentData) => {
		try {
			await fetch(`http://localhost:5000/api/posts/:${postid}/comments`, {
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify(commentData)
			})
				.then(res => res.json(), err => console.log('error from add post: ', err))
				.then(data => {
					console.log('added comment: ', data)
					setPosts({ type: 'comment', data })
				})
		} catch (err) { throw err }
	}

	const classes = styles()
	return (
		<>

			<div className={classes.commentSection}>
				
				<form onSubmit={(e) => { e.preventDefault(); addComment(commentData); setFormView({ formName: 'overlay' }) }}>
					<textarea className={classes.commentInput}
						type='text' name='text'
						placeholder="Write a comment ..." maxLength="128"
						value={commentData.text} onChange={handleChange}>
					</textarea>
					<button className="submit-btn" type='submit'> add </button>
				</form>

				{ comments == true &&
					comments.map((comment) => (
						<div className="comment">
							<p className="comment-author">{comment.author}</p>
							<p className="comment-text">{comment.text}</p>
						</div>
					))
				}

			</div>
		</>
	)
}

export default CommentSection