import React, { useContext } from "react"
import ChatBoard from "./ChatBoard"
import PostsContext from "./PostsContext"
import HandlerContext from "./HandlersContext"
import styles from "../styles/chatStyles"
// import PostForm from "./PostForm"
// import EditForm from "./EditForm"

const Chat = () => {
	const { user, formView } = useContext(PostsContext)
	const { setPosts, setFormView } = useContext(HandlerContext)
	const classes = styles()

	// mock messages
	const messages = [
		{
			_id: 1,
			sender_id: "Brogrammer",
			text: "hey bro how're you",
			date: "2022-10-30T08:23:39.345+00:00",
			reactions: [{ user: "John", emoji: "👋" }]
		},
		{
			_id: 2,
			sender_id: "John",
			text: "hey, I'm fine, and you ?",
			date: "2022-10-30T08:24:55.345+00:00",
			reactions: [{ user: "Brogrammer", emoji: "👍" }]
		},
		{
			_id: 3,
			sender_id: "Brogrammer",
			text: "I'm also fine, are you going out today?",
			date: "2022-10-30T08:25:39.345+00:00",
			reactions: [{ user: "John", emoji: "💯" }]
		},
	]


	return (
		<div className={classes.posts} style={{ display: user.username ? "block" : "none" }}>

			{user.username &&
				<button className="add-post-btn" onClick={() => setFormView({ formName: 'post' })} >
					Add
				</button>}

			{/* 
				{user.username && formView.post &&
					<PostForm />
				} */}

			{user.username && formView.edit.view &&
				<EditChat />
			}

			<ChatBoard messages={messages} />

		</div>
	)
}

export default Chat