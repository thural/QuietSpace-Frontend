import React, { useContext } from "react"
import HandlerContext from "./HandlersContext"
import PostsContext from "./PostsContext"
import styles from "../styles/messageStyles"

const Message = ({ message }) => {

	const { user } = useContext(PostsContext)
	const { setPosts, setFormView } = useContext(HandlerContext)
	const classes = styles()
	const { sender_id, text, reactions } = message
	const liked = reactions.includes(user['_id']) ? 'unlike' : 'like'
	const margin = message.sender_id !== user.username ? "auto" : "0"

	return (

		<div id={sender_id} className={classes.message} style={{marginLeft:{margin}}}>

			<div className="author">
				{sender_id}
			</div>

			<div className="message">
				<p>{text}</p>
			</div>

			{user.username &&
				<div className="buttons">

					{sender_id !== user.username &&
						<button onClick={() => setPosts({ _id: sender_id, user, type: liked })}>
							{reactions.length} {liked}
						</button>
					}

					{message.username == user.username &&
						<button onClick={() => setFormView({ formName: 'edit', _id: sender_id })}>
							edit
						</button>
					}

					{user.admin || message.username == user.username &&
						<button onClick={() => setPosts({ _id: sender_id, user, type: 'delete' })}>
							delete
						</button>
					}

				</div>
			}

		</div>
	)
}

export default Message