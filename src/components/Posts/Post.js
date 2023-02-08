import React, { useContext, useState } from "react"
import HandlerContext from "../MainContext"
import styles from "./styles/postStyles"
import likeIcon from "../../assets/thumbs.svg"
import shareIcon from "../../assets/share.svg"
import editIcon from "../../assets/edit.svg"
import commentIcon from "../../assets/comment-3-line.svg"
import deleteIcon from "../../assets/delete-bin-line.svg"
import CommentSection from "./CommentSection"

const Post = ({ post }) => {
	const { _id, username, text, likes, comments } = post
	const { loggedUser, setPosts, setFormView } = useContext(HandlerContext)
	const [active, setActive] = useState(false)
	const liked = post.likes.includes(loggedUser['_id']) ? 'unlike' : 'like'

	const deletePost = async (_id) => {
		try {
		  await fetch(`http://localhost:5000/api/posts/delete/${_id}`, { method: 'POST' })
				.then(res => res.json(), err => console.log('error from delete post: ', err))
				.then(data => {
					console.log('deleted post: ', data);
					setPosts({ _id, user: loggedUser, type: 'delete' })
				})
		} catch (err) { throw err }
	}

	const likePost = async (_id) => {
		try {
			await fetch(`http://localhost:5000/api/posts/like/${_id}`, { method: 'POST' })
				.then(res => res.json(), err => console.log('error from like post: ', err))
				.then(data => {
					console.log('liked post: ', data);
					setPosts({ _id, user: loggedUser, type: 'like' })
				})
		} catch (err) { throw err }
	}

	const classes = styles()
	return (
		<div id={_id} className={classes.wrapper}>

			<div className="author">
				{username}
			</div>

			<div className="text">
				<p>{text}</p>
			</div>

			<div className={classes.postinfo}>
				<p className="likes" >{likes.length} likes</p>
				<p>{comments.length} comments </p>
				<p>0 shares</p>
			</div>

			{loggedUser.username &&
				<>
					<hr></hr>

					<div className="panel">

						{post.username !== loggedUser.username &&
							<img src={likeIcon} onClick={() => likePost(_id)} />
						}

						<img src={commentIcon} onClick={() => setActive(active ? false : true)} />

						{post.username == loggedUser.username &&
							<img src={editIcon} onClick={() => setFormView({ formName: 'edit', _id })} />
						}

						<img src={shareIcon} />

						{loggedUser.admin || post.username == loggedUser.username &&
							<img src={deleteIcon} onClick={() => deletePost(_id)} />
						}

					</div>

					{ active &&
						<CommentSection _id={_id} comments={comments} />
					}
				</>
			}





		</div>
	)
}

export default Post