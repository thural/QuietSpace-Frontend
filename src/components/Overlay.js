import { overlay } from "../redux/formViewReducer"
import styles from "../styles/overlayStyles"
import { useDispatch } from "react-redux"
import React from "react"


const Overlay = () => {
  const classes = styles()
  const dispatch = useDispatch()

  return (
    <div className={classes.overlay} onClick={() => dispatch(overlay())}></div>
  )
}

export default Overlay