import React, { useContext, useState } from "react"
import ChatContext from "./ChatContext"
import Message from "./Message"
import styles from "../styles/chatBoardStyles"

const ChatBoard = ({ messages }) => {

	const { currentChat, setChat } = useContext(ChatContext)

	const [textData, setTextData] = useState({ text: '' })

	const handleChange = (event) => {
		const { name, value } = event.target
		setTextData({ ...textData, [name]: value })
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		sendMessage(textData);
		setTextData({...textData, text: ''})
	}

	//console.log("currentChat: ", currentChat)

	const sendMessage = async (messageData) => {
		try {
			await fetch(`http://localhost:5000/api/chats/send/6364d1833ad132dc27e28e6c`, {
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify(messageData)
			})
				.then(res => res.json(), err => console.log('error from add message: ', err))
				.then(data => {
					console.log('message: ', data);
					setChat({ type: 'add', messageData })
				})
		} catch (err) { throw err }
	}

	const classes = styles()
	return (
		<div className={classes.chatboard}>
			{
				messages.map((message) => (<Message key={message._id} message={message} />))
			}

			<form className={classes.chatInput} onSubmit={handleSubmit}>
				<input
					className='input'
					type='text' name='text'
					placeholder="text" maxLength="128"
					value={textData.message} onChange={handleChange}
				/>
				<button className={classes.submitBtn} type='submit'> send </button>
			</form>

		</div>
	)
}

export default ChatBoard