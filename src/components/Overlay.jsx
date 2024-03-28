import styles from "../styles/overlayStyles"
import React from "react"


const Overlay = ({closable}) => {
  const classes = styles();
  const active = !(closable === undefined || closable === null);
  return (
      <div className={classes.overlay} onClick={() => {
        if (active) console.log("write overlay dispatch logic");
      }}>
      </div>
  )
}

export default Overlay