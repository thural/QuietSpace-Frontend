import React, { useContext } from "react";
import { createUseStyles } from "react-jss";
import HandlerContext from "./Handlers"

const useStyles = createUseStyles({
  wrapper: {
    border: 'grey solid 1px',
    display: 'grid',
    padding: '1rem',
    borderRadius: '1rem',
    justifyItems: 'center',
    backgroundColor: 'white',
    gridTemplateRows: '3fr 1.5rem 3rem',
    boxShadow: 'rgb(0 0 0 / 25%) -16px 0px 32px -8px',
    '& img': {
      margin: 'auto',
      maxWidth: 'inherit',
      maxHeight: 'inherit',
    },
    '& .image': {
      display: 'flex',
      maxWidth: '12rem',
      minWidth: '8rem',
      maxHeight: '12rem',
      minHeight: '8rem',
      marginBottom: '1rem'
    },
    '& .title': {
      width: '100%',
      margin: '0px',
      borderTop: '1px solid black',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: '2',
      lineClamp: '2',
      WebkitBoxOrient: 'vertical'
    },
    '& h3': {
      textAlign: 'center',
      fontSize: '1rem',
      margin: '0px'
    },
    '& p': {
      display: 'inline-block',
      marginRight: '1rem'
    },
    '& button': {
      color: 'white',
      backgroundColor: 'black',
      borderRadius: '1rem',
      padding: '0.2rem 0.6rem'
    }
  },
});

const Card = ({ card }) => {
  const handleCart = useContext(HandlerContext);
  const classes = useStyles();
  const { id, title, price, image } = card;
  return (
    <div id={id} className={classes.wrapper}>
      <div className="image"><img src={image}></img></div>
      <div className="title"><h3>{title}</h3></div>
      <div className="add">
        <p>${price}</p>
        <button onClick={() => handleCart({ id, type: 'increment', item: card })}>
          add to cart
        </button>
      </div>
    </div>
  )
}

export default Card