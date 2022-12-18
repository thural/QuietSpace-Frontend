import React, { useContext, useState } from "react"
//import PostsContext from "./PostsContext"
import HandlerContext from "./HandlersContext"
import Message from "./Message"
import styles from "../styles/chatBoardStyles"

const ChatBoard = ({ messages }) => {

	//const { messages } = useContext(PostsContext)
	const { setChat } = useContext(HandlerContext);
	const classes = styles()

	const [messageData, setMessageData] = useState({ message: '' })

	const handleChange = (event) => {
		const { name, value } = event.target
		setMessageData({ ...messageData, [name]: value });
	}

	const sendMessage = async (messageData) => {
		try {
			await fetch(`http://localhost:5000/api/chat/${_id}`, {
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify(messageData)
			})
				.then(res => res.json(), err => console.log('error from add post: ', err))
				.then(data => {
					console.log('message: ', data);
					setChat({ type: 'add', data })
				})
		} catch (err) { throw err }
	}

	return (
		<div className={classes.chatboard}>
			{
				messages.map((message) => (<Message key={message._id} message={message} />))
			}

			<form className={classes.chatInput} onSubmit={(e) => { e.preventDefault(); sendMessage(messageData) }}>
				<input
					className='input'
					type='text' name='message'
					placeholder="message" maxLength="64"
					value={messageData.message} onChange={handleChange}
				/>
				<button className={classes.submitBtn} type='submit'> send </button>
			</form>

		</div>
	)
}

export default ChatBoard