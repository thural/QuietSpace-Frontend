import React, {useContext} from "react";
import { createUseStyles } from "react-jss";
import PostsContext from "./PostsContext";
import Card from "./Card";

const useStyles = createUseStyles({
  cardboard: {
    gap: '24px',
    width: '100%',
    margin: 'auto',
    display: 'grid',
    gridTemplateRows: 'repeat( auto-fit, minmax(12rem, 1fr) )',
    gridTemplateColumns: 'repeat( auto-fit, minmax(12rem, 1fr) )'
  }
});

const CardBoard = () => {
  const {posts:cards} = useContext(PostsContext);
  const classes = useStyles();

  return (
    <div className={classes.cardboard}>
      {
        cards.map((card) => (<Card key={card._id} card={card} />))
      }
    </div>
  )
}

export default CardBoard