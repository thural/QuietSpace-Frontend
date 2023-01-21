import React, { useContext, useState, useReducer, useEffect } from "react"
import ChatBoard from "./ChatBoard"
import ContactBoard from "./ContactBoard"
import HandlerContext from "./HandlerContext"
import ChatContext from "./ChatContext"
import styles from "../styles/chatStyles"

const data = [
	{
	 user_id : "Brogrammer",
	 messages: [
		{
			_id: 1,
			user_id: "Brogrammer",
			text: "Hi man how're u doing",
			date: "2022-10-30T08:23:39.345+00:00",
			reactions: [{ user: "John", emoji: "👋" }]
		},
		{
			_id: 2,
			user_id: "John",
			text: "Hi, walking my dog.. you?",
			date: "2022-10-30T08:24:55.345+00:00",
			reactions: [{ user: "Brogrammer", emoji: "👍" }]
		},
		{
			_id: 3,
			user_id: "Brogrammer",
			text: "Coding as always.. You going to the party tonight? 🤔",
			date: "2022-10-30T08:24:59.345+00:00",
			reactions: [{ user: "John", emoji: "💯" }]
		},
	 ]
	},
	{
	  user_id:"Lera",
		messages: [
			{
				_id: 1,
				user_id: "Lera",
				text: "Hi, what movies can you suggest for tonight",
				date: "2022-10-30T08:23:36.345+00:00",
				reactions: [{ user: "John", emoji: "👋" }]
			},
			{
				_id: 2,
				user_id: "John",
				text: "Hi, BladeRunner, Joker(2019) and Taxi Driver",
				date: "2022-10-30T08:24:50.345+00:00",
				reactions: [{ user: "Susan", emoji: "👍" }]
			},
			{
				_id: 3,
				user_id: "Lera",
				text: "Thanks gonna check these for now 👍",
				date: "2022-10-30T08:24:56.345+00:00",
				reactions: [{ user: "John", emoji: "💯" }]
			},
		]
	},
];

function chatReducer(state, { messages, data, chat, user, sender_id, type }) {
	switch (type) {
		case 'init':
			console.log('data from reducer: ', data)
			return data
		// case 'load':
		// 	return chat.find(sender => sender.some(message => message['sender_id'] == sender_id))
		default: return state
	}
}

const Chat = () => {
	const { user } = useContext(HandlerContext)
	const [chat, setChat] = useReducer(chatReducer, data)

	//useEffect(() => setChat({ data, type: 'init' }), [])

	const contacts = chat.map(contact => contact.messages.findLast(message => message.user_id !== user.username))

	const [currentChat, setCurrentChat] = useState(contacts[0]['user_id'])

	const messages = chat.find(contact => contact.user_id == currentChat).messages

	const classes = styles()
	return (
		<div className={classes.chat}>

			<ChatContext.Provider value={{ chat, setChat, currentChat, setCurrentChat }} >
				<ContactBoard contacts={contacts} />
				<ChatBoard messages={messages} />
			</ChatContext.Provider>

		</div>
	)
}

export default Chat