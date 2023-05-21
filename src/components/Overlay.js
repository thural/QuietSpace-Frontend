import React, { useContext } from "react"
import styles from "../styles/overlayStyles"
import { useDispatch } from "react-redux"


const Overlay = () => {
  const classes = styles()
  const dispatch = useDispatch()

  return (
    <div className={classes.overlay} onClick={() => dispatch({ type: 'overlay' })}></div>
  )
}

export default Overlay