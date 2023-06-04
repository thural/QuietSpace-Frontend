import React from "react"
import styles from "./styles/messageStyles"
import { useSelector } from "react-redux"

const Message = ({ message }) => {

  const user = useSelector(state => state.userReducer)

  const { username, text, reactions } = message

  //const liked = reactions.includes(user['_id']) ? 'unlike' : 'like'
  
  const appliedStyle = username !== user.username ? {marginLeft:"auto"} : {marginRight:"auto"}

  const classes = styles()

  return (
    <div id={username} className={classes.message} style={appliedStyle}>
      <div className={classes.sender}>{username}</div>
      <div className={classes.text}><p>{text}</p></div>
    </div>
  )

}

export default Message