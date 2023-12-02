import React from "react"
import styles from "./styles/messageStyles"
import { useSelector } from "react-redux"

const Message = ({ message }) => {

  const user = useSelector(state => state.userReducer)
  const { username, text, reactions } = message
  const appliedStyle = username !== user.username ? {marginRight:"auto"} : {marginLeft:"auto", backgroundColor:'#f1f1f1'}

  const classes = styles()
  return (
    <div id={username} className={classes.message} style={appliedStyle}>
      {/* <div className={classes.sender}>{username}</div> */}
      <div className={classes.text}><p>{text}</p></div>
    </div>
  )

}

export default Message