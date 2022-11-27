import React from "react";
import styles from "../styles/overlayStyles"
import HandlerContext from "./HandlersContext"


const Overlay = () => {
  const classes = styles();
  const { toggleComponent } = useContext(HandlerContext);

  return (
    <div className={classes.overlay} onClick={() => toggleComponent('overlay')}></div>
  )
};

export default Overlay;
