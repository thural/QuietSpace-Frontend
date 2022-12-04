import React, { useContext } from "react"
import HandlerContext from "./HandlersContext"
import PostsContext from "./PostsContext"
import styles from "../styles/cardStyles"

const Card = ({ card }) => {
	const { user } = useContext(PostsContext);
	const { setPosts, toggleComponent } = useContext(HandlerContext);
	const classes = styles()
	const { _id, username, message, likes } = card
	const liked = card.likes.includes(user['_id']) ? 'unlike' : 'like'

	return (
		<div id={_id} className={classes.wrapper}>

			<div className="author">
				{username}
			</div>

			<div className="message">
				<p>{message}</p>
			</div>

			{user.username &&
				<div className="buttons">

					<button onClick={() => setPosts({ _id, user, type: liked })}>
						{likes.length} {liked}
					</button>

					{card.username == user.username &&
						<button onClick={() => toggleComponent({formName:'edit', _id})}>
							edit
						</button>
					}

					{user.admin || card.username == user.username &&
						<button onClick={() => setPosts({ _id, user, type: 'delete' })}>
							delete
						</button>
					}

				</div>
			}

		</div>
	)
}

export default Card