import React from "react"
import styles from "./styles/messageStyles"
import { useSelector } from "react-redux"

const Message = ({ message }) => {

  const user = useSelector(state => state.userReducer);
  const { id, sender, text, reactions } = message;
  const senderName = sender.username;

  const appliedStyle = sender.username !== user.username ? {marginRight:"auto"} : {marginLeft:"auto", backgroundColor:'#f1f1f1'};

  const classes = styles()
  return (
    <div id={id} className={classes.message} style={appliedStyle}>
       <div className={classes.sender}>{senderName}</div>
      <div className={classes.text}><p>{text}</p></div>
    </div>
  )

}

export default Message