import React, { useContext, useState, useReducer, useEffect } from "react"
import ChatBoard from "./ChatBoard"
import ContactBoard from "./ContactBoard"
import PostsContext from "./PostsContext"
import HandlerContext from "./HandlersContext"
import ChatContext from "./ChatContext"
import styles from "../styles/chatStyles"
import { matchPath } from "react-router-dom"
// import PostForm from "./PostForm"
// import EditForm from "./EditForm"

const chat = [
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

function messagesReducer(state, { messages, data, chat, user, sender_id, type }) {
	switch (type) {
		// case 'like':
		// 	return state.map(post => {
		// 		if (post['_id'] == sender_id) {
		// 			if (post.likes.includes(user['id'])) return post
		// 			const postLikes = [...post.likes, user['_id']]
		// 			return { ...post, likes: postLikes }
		// 		}
		// 		return post
		// 	})
		// case 'unlike':
		// 	return state.map(post => {
		// 		if (post['_id'] == sender_id) {
		// 			const reducedLikes = post.likes.filter(likeId => likeId !== user['_id'])
		// 			return { ...post, likes: reducedLikes }
		// 		}
		// 		return post
		// 	})
		// case 'delete':
		// 	deletePost(sender_id)
		// 	return state.filter(post => post['_id'] !== sender_id)
		// case 'add':
		// 	const newState = [data, ...state]
		// 	//console.log('data after "add" reducer: ', data)
		// 	return newState // TODO: first figure out the response and then get back here.
		// case 'edit':
		// 	return state.map(message => message['_id'] == sender_id ? data : message)
		case 'init':
			return chat[0]
		case 'load':
			return chat.find(sender => sender.some(message => message['sender_id'] == sender_id))
		default: return state
	}
}

const Chat = () => {
	const { user } = useContext(PostsContext)
	const classes = styles()

	const [messages, setMessages] = useReducer(messagesReducer, [])

	useEffect(() => setMessages({ chat, type: 'init' }), [])


	// const contacts = [
	// 	{
	// 		_id: 1,
	// 		sender_id: "Brogrammer",
	// 		text: "Coding as always.. You going to the party tonight? 🤔",
	// 	},
	// 	{
	// 		_id: 3,
	// 		sender_id: "Susan",
	// 		text: "Thanks gonna check these for now 👍",
	// 	},
	// ]

	const contacts = chat.map(sender => sender
		.findLast(message => message['sender_id'] !== user.username))


	return (
		<div className={classes.chat}>

			<ChatContext.Provider value={{ setMessages, chat }} >
				<ContactBoard contacts={contacts} />
				<ChatBoard messages={messages} />
			</ChatContext.Provider>

		</div>
	)
}

export default Chat