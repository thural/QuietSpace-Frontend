import React, { useContext} from "react";
import { createUseStyles } from "react-jss";
import PostsContext from "./PostsContext";

const useStyle = createUseStyles({
  overlay: {
    display: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  }
})
const Overlay = () => {
  const { user } = useContext(PostsContext);
  const classes = useStyle();

  return (
    <div className={classes.overlay}></div>
  )
};

export default Overlay;
