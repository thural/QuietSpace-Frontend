import { useContext } from "react"
import styles from "./styles/contactStyles"
import ChatContext from "./ChatContext"
import { useSelector } from "react-redux"

const Contact = ({ contact }) => {

  const classes = styles()
  const user = useSelector(state => state.userReducer)
  const { currentChat, setCurrentChat } = useContext(ChatContext)
  const backgroundColor = currentChat == contact['_id'] ? '#e3e3e3' : 'white'
  const contactName = contact.messages
    .findLast(message => message.username != user.username)
    .username
  const recentText = contact.messages[contact.messages.length - 1].text

  return (
    <div
      id={contactName}
      className={classes.contact}
      onClick={() => { setCurrentChat(contact['_id']) }}
      style={{ backgroundColor }}
    >
      <div className={classes.author}>{contactName}</div>
      <div className={classes.text}><p>{recentText}</p></div>
    </div>
  )
}

export default Contact