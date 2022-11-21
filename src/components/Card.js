import React, { useContext } from "react"
import HandlerContext from "./HandlersContext"
import PostsContext from "./PostsContext"
import styles from "../styles/cardStyles"

const Card = ({ card }) => {
  const { user } = useContext(PostsContext);
  const handleCard = useContext(HandlerContext);
  const classes = styles()
  const { _id, username, message, likes } = card;
  const liked = card.likes.includes(user['_id']) ? 'unlike' : 'like';
  return (
    <div id={_id} className={classes.wrapper}>
      <div className="author">
        {username}
      </div>
      <div className="message">
        <p>{message}</p>
      </div>
      {user &&
        <div className="buttons">
          <p>{likes.length}</p>
          <button onClick={() => handleCard({ _id, user, type: liked })}>{liked}</button>
          {card.username == user.username &&
            <button onClick={() => handleCard({ _id, user, type: 'edit' })}>edit</button>
          }
          {user.admin || card.username == user.username &&
            <button onClick={() => handleCard({ _id, user, type: 'delete' })}>delete</button>
          }
        </div>
      }
    </div>
  )
}

export default Card