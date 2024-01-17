import {overlay} from "../redux/formViewReducer"
import styles from "../styles/overlayStyles"
import {useDispatch} from "react-redux"
import React from "react"


const Overlay = ({closable}) => {
  const classes = styles();
  const dispatch = useDispatch();
  const active = !(closable === undefined || closable === null);
  return (
      <div className={classes.overlay} onClick={() => {
        if (active) dispatch(overlay());
      }}>
      </div>
  )
}

export default Overlay