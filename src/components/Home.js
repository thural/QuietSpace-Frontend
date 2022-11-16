import React from "react";
import { Link } from "react-router-dom";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  wrapper: {
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20vh',
    '& .home-text': {
      minWidth: 'min-content',
      display: 'flex',
      flexFlow: 'column nowrap',
      justifyContent: 'center',
      alignItems: 'center'
    },
    '& h1': {
      marginBottom: '6rem'
    },
    '& button': {
      fontSize: '2rem',
      backgroundColor: 'black',
      color: 'white',
      padding: '1rem 3rem',
      fontWeight: '600',
      border: '1px solid black',
      borderRadius: '3rem',
      width: 'max-content'
    }
  }
})

const Home = () => {
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <div className="home-text">
        <h3>"Contribute to society by speaking your truth"</h3>
        <h1>Free speech is the foundation of a healthy society</h1>
        <Link to="/posts"><button>Post now</button></Link>
      </div>
      <div className="home-image"></div>
    </div>
  );
};

export default Home;