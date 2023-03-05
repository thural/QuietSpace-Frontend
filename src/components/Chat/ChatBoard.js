import React, { useContext, useState } from "react"
import ChatContext from "./ChatContext"
import Message from "./Message"
import styles from "./styles/chatBoardStyles"
import MainContext from "../MainContext"

const ChatBoard = ({ messages }) => {

  const { currentChat } = useContext(ChatContext)
  const { setChat } = useContext(MainContext)
  const [textData, setTextData] = useState({ text: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setTextData({ ...textData, [name]: value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    sendMessage(textData)
    setTextData({ ...textData, text: '' })
  }

  const sendMessage = async (messageData) => {
    try {
      await fetch(`http://localhost:5000/api/chats/send/${currentChat}`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(messageData)
      })
        .then(res => res.json(), err => console.log('error from add message: ', err))
        .then(data => { setChat({ type: 'addMessage', messageData, currentChat }) })
    } catch (err) { throw err }
  }


  const classes = styles()

  return (
    <div className={classes.chatboard}>
      <div className={classes.messages} >
        {
          messages.map(message => <Message key={message._id} message={message} />)
        }
      </div>

      <form className={classes.chatInput} onSubmit={handleSubmit}>
        <input
          className='input'
          type='text'
          name='text'
          placeholder="Write a message ..."
          maxLength="128"
          value={textData.message}
          onChange={handleChange}
        />
        <button className={classes.submitBtn} type='submit'> send </button>
      </form>
    </div>

  )
}

export default ChatBoard