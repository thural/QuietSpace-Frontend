import React from "react";
import { createUseStyles } from "react-jss";
import logo from "../assets/github-svgrepo-com.svg"

const useStyles = createUseStyles({
  wrapper: {
    boxSizing: 'border-box',
    display: 'flex',
    width: '100%',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    justifyContent:'center',
    gap: '1rem',
    position: 'absolute',
    bottom:'0',
    margin: '0',
    padding: '1rem',
    textDecoration: 'none',
    color: 'black',
    textDecoration: 'inherit',
    fontWeight: 'inherit',
  },
  '& a, a:link, a:visited, a:hover, a:focus, a:active': {
    textDecoration: 'none',
    color: 'black',
    textDecoration: 'inherit',
    fontWeight: 'inherit',
  },

})

const Copyright = () => {
  const classes = useStyles();

  return (
    <a href='https://github.com/thural'className={classes.wrapper}>
      <p>Copyright © 2022 thural</p>
      <img src={logo}></img>
    </a>
  );
};

export default Copyright;