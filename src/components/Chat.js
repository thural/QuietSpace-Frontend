import React, { useContext, useState, useReducer, useEffect } from "react"
import ChatBoard from "./ChatBoard"
import ContactBoard from "./ContactBoard"
import PostsContext from "./PostsContext"
import ChatContext from "./ChatContext"
import styles from "../styles/chatStyles"

const data = [
	[
		{
			_id: 1,
			sender_id: "Brogrammer",
			text: "Hi man how're u doing",
			date: "2022-10-30T08:23:39.345+00:00",
			reactions: [{ user: "John", emoji: "👋" }]
		},
		{
			_id: 2,
			sender_id: "John",
			text: "Hi, walking my dog.. you?",
			date: "2022-10-30T08:24:55.345+00:00",
			reactions: [{ user: "Brogrammer", emoji: "👍" }]
		},
		{
			_id: 3,
			sender_id: "Brogrammer",
			text: "Coding as always.. You going to the party tonight? 🤔",
			date: "2022-10-30T08:24:59.345+00:00",
			reactions: [{ user: "John", emoji: "💯" }]
		},
	],
	[
		{
			_id: 1,
			sender_id: "Susan",
			text: "Hi, what movies can you suggest for tonight",
			date: "2022-10-30T08:23:36.345+00:00",
			reactions: [{ user: "John", emoji: "👋" }]
		},
		{
			_id: 2,
			sender_id: "John",
			text: "Hi, BladeRunner, Joker(2019) and Taxi Driver",
			date: "2022-10-30T08:24:50.345+00:00",
			reactions: [{ user: "Susan", emoji: "👍" }]
		},
		{
			_id: 3,
			sender_id: "Susan",
			text: "Thanks gonna check these for now 👍",
			date: "2022-10-30T08:24:56.345+00:00",
			reactions: [{ user: "John", emoji: "💯" }]
		},
	],
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
	const { user } = useContext(PostsContext)
	const classes = styles()
	const [chat, setChat] = useReducer(chatReducer, data)

	//useEffect(() => setChat({ data, type: 'init' }), [])

	console.log('CHAT DATA: ', chat)

	const contacts = chat.map(sender => sender
		.findLast(message => message['sender_id'] !== user.username))

	const [selectedChat, setSelectedChat] = useState(contacts[0]['sender_id'])

	const messages = chat.find(sender => sender
		.some(message => message['sender_id'] == selectedChat))

	return (
		<div className={classes.chat}>

			<ChatContext.Provider value={{ chat, setChat, selectedChat, setSelectedChat }} >
				<ContactBoard contacts={contacts} />
				<ChatBoard messages={messages} />
			</ChatContext.Provider>

		</div>
	)
}

export default Chat