import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import CardBoard from "./CardBoard";

const useStyle = createUseStyles({
  products: {
    margin: 'auto',
    padding: '10vh 10vw',
  }
})
const Posts = () => {

  const classes = useStyle();

  return (
    <div className={classes.products}>
      <CardBoard />
    </div>
  )
};

export default Posts;
