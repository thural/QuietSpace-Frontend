import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  wrapper: {
    margin: 'auto',
    padding: '10vw',
    '& .content': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }
  },

})

const Contact = () => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className="content">
        <h3>FakeStore</h3>
        <h3>Tel: +263 111 22 33</h3>
        <h1>Hills drive 49, Zimbabwe</h1>
      </div>
    </div>
  );
};

export default Contact;