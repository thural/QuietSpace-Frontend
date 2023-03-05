import React, { useContext } from "react"
import styles from "../styles/overlayStyles"
import HandlerContext from "./MainContext"


const Overlay = () => {
  const classes = styles()
  const { setFormView } = useContext(HandlerContext)

  return (
    <div className={classes.overlay} onClick={() => setFormView({ formName: 'overlay' })}></div>
  )
}

export default Overlay