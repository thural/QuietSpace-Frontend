import React, { useContext } from "react"
import ChatBoard from "./ChatBoard"
import ContactBoard from "./ContactBoard"
import PostsContext from "./PostsContext"
import HandlerContext from "./HandlersContext"
import styles from "../styles/chatStyles"
// import PostForm from "./PostForm"
// import EditForm from "./EditForm"

const Chat = () => {
	const { user, formView } = useContext(PostsContext)
	const { setPosts, setFormView } = useContext(HandlerContext)
	const classes = styles()

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
	]
	// mock messages
	const messages = [
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
	];

	const contacts = [
		{
			_id: 1,
			sender_id: "Brogrammer",
			text: "Coding as always.. You going to the party tonight? 🤔",
		},
		{
			_id: 3,
			sender_id: "Susan",
			text: "Thanks gonna check these for now 👍",
		},
	]


	return (
		<div className={classes.chat}>

				<ContactBoard contacts={contacts} />

				<ChatBoard messages={messages} />

		</div>
	)
}

export default Chat