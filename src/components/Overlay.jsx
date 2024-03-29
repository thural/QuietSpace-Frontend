import { viewStore } from "../hooks/zustand";
import styles from "../styles/overlayStyles"
import React from "react"


const Overlay = ({closable}) => {
  const {setViewData} = viewStore();
  const classes = styles();
  const active = !(closable === undefined || closable === null);

  return (
      <div className={classes.overlay} onClick={() => {
        if (active) setViewData({overlay:false, ...closable});
      }}
      ></div>
  )
}

export default Overlay