import React, { useContext } from "react"
import HandlerContext from "./HandlersContext"
import PostsContext from "./PostsContext"
import styles from "../styles/cardStyles"

const Message = ({ message }) => {
	const { user } = useContext(PostsContext)
	const { setPosts, setFormView } = useContext(HandlerContext)
	const classes = styles()
	const { _id, username, text, likes } = message
	const liked = message.likes.includes(user['_id']) ? 'unlike' : 'like'

	return (
		<div id={_id} className={classes.wrapper}>

			<div className="author">
				{username}
			</div>

			<div className="message">
				<p>{text}</p>
			</div>

			{user.username &&
				<div className="buttons">

					<button onClick={() => setPosts({ _id, user, type: liked })}>
						{likes.length} {liked}
					</button>

					{message.username == user.username &&
						<button onClick={() => setFormView({formName:'edit', _id})}>
							edit
						</button>
					}

					{user.admin || message.username == user.username &&
						<button onClick={() => setPosts({ _id, user, type: 'delete' })}>
							delete
						</button>
					}

				</div>
			}

		</div>
	)
}

export default Message