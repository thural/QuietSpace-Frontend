import React, { useContext } from "react"
import { createUseStyles } from "react-jss"
import HandlerContext from "./HandlersContext"

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
    '& .message':{
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
  const handleCard = useContext(HandlerContext);
  const classes = useStyles();
  const { id, username, message, likes } = card;
  return (
    <div id={id} className={classes.wrapper}>
      <div className="author">
        {username}
      </div>
      <div className="message">
        <p>{message}</p>
      </div>
      <div className="buttons">
        <p>{likes.length}</p>
        <button onClick={() => handleCard({ id, type: 'like', item: card })}>like</button>
        <button onClick={() => handleCard({ id, type: 'edit', item: card })}>edit</button>
        <button onClick={() => handleCard({ id, type: 'delete', item: card })}>delete</button>
      </div>
    </div>
  )
}

export default Card