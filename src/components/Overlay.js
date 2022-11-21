import React, { useContext} from "react";
import styles from "../styles/overlayStyles"


const Overlay = ({toggleComponent}) => {
  const classes = styles();

  return (
    <div className={classes.overlay} onClick={() => toggleComponent('overlay')}></div>
  )
};

export default Overlay;
