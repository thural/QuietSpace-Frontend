import React, { useContext, useState } from "react"
import HandlerContext from "./HandlerContext"
import styles from "../styles/postStyles"
import likeIcon from "../assets/thumbs.svg"
import shareIcon from "../assets/share.svg"
import editIcon from "../assets/edit.svg"
import commentIcon from "../assets/comment-3-line.svg"
import deleteIcon from "../assets/delete-bin-line.svg"
import CommentSection from "./CommentSection"

const Post = ({ post }) => {
	const { _id, username, text, likes, comments } = post
	const { user, setPosts, setFormView } = useContext(HandlerContext)
	const [active, setActive] = useState(false)
	const liked = post.likes.includes(user['_id']) ? 'unlike' : 'like'

	const deletePost = async (_id) => {
		try {
			await fetch(`http://localhost:5000/api/posts/delete/${_id}`, { method: 'POST' })
				.then(res => res.json(), err => console.log('error from add post: ', err))
				.then(data => {
					console.log('deleted post: ', data);
					setPosts({ _id, user, type: 'delete' })
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
				<p>0 comments </p>
				<p>0 shares</p>
			</div>

			{user.username &&
				<>
					<hr></hr>

					<div className="panel">

						{post.username !== user.username &&
							<img src={likeIcon} onClick={() => setPosts({ _id, user, type: 'like' })} />
						}

						<img src={commentIcon} onClick={() => setActive(active ? false : true)} />

						{post.username == user.username &&
							<img src={editIcon} onClick={() => setFormView({ formName: 'edit', _id })} />
						}

						<img src={shareIcon} />

						{user.admin || post.username == user.username &&
							<img src={deleteIcon} onClick={() => deletePost(_id)} />
						}

					</div>

					{ active &&
						<CommentSection postid={_id} comments={comments} />
					}
				</>
			}





		</div>
	)
}

export default Post