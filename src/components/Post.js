import React, { useContext } from "react"
import HandlerContext from "./HandlerContext"
import styles from "../styles/postStyles"
import likeIcon from "../assets/thumbs.svg"
import shareIcon from "../assets/share.svg"
import editIcon from "../assets/edit.svg"
import commentIcon from "../assets/comment-3-line.svg"

const Post = ({ post }) => {
	const { _id, username, text, likes } = post
	const { user, setPosts, setFormView } = useContext(HandlerContext)
	const liked = post.likes.includes(user['_id']) ? 'unlike' : 'like'

	const classes = styles()
	return (
		<div id={_id} className={classes.wrapper}>

			<div className="author">
				{username}
			</div>

			<div className="text">
				<p>{text}</p>
			</div>

			{/*user.username &&
				<div className="buttons">
					{post.username !== user.username &&
						<button onClick={() => setPosts({ _id, user, type: 'liked' })}>
							{likes.length} {liked}
						</button>
					}

					{post.username == user.username &&
						<button onClick={() => setFormView({ formName: 'edit', _id })}>
							edit
						</button>
					}

					{user.admin || post.username == user.username &&
						<button onClick={() => setPosts({ _id, user, type: 'delete' })}>
							delete
						</button>
					}
				</div>
			*/}

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
						<img src={likeIcon} onClick={() => setPosts({ _id, user, type: 'liked' })}/>
					}

					<img src={commentIcon} />

					{post.username == user.username &&
						<img src={editIcon} onClick={() => setFormView({ formName: 'edit', _id })} />
					}

					<img src={shareIcon} />

				</div>
			</>
			}





		</div>
	)
}

export default Post