import React, { useContext } from "react"
import { createUseStyles } from "react-jss"
import HandlerContext from "./HandlersContext"
import PostsContext from "./PostsContext"

const useStyles = createUseStyles({
  wrapper: {
    border: 'grey solid 1px',
    display: 'grid',
    padding: '1rem',
    borderRadius: '1rem',
    justifyItems: 'center',
    backgroundColor: 'white',
    boxShadow: 'rgb(0 0 0 / 25%) -16px 0px 32px -8px',
    '& .author': {
      width: '100%',
      fontSize: '1.2rem',
      fontWeight: '500'
    },
    '& .message': {
      fontSize: '1rem',
      fontStyle: 'italic',
      padding: 0,
      margin: '0px'
    },
    '& .buttons': {
      display: 'flex',
      flexFlow: 'row nowrap',
      alignItems: 'center',
      gap: '4px'
    },
    '& button': {
      color: 'white',
      backgroundColor: 'black',
      borderRadius: '1rem',
      padding: '0.2rem 0.6rem'
    }
  },
})

const Card = ({ card }) => {
  const { user } = useContext(PostsContext);
  const handleCard = useContext(HandlerContext);
  const classes = useStyles();
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