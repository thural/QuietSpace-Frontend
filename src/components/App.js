import React, { useState, useReducer, useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import HandlerContext from "./HandlerContext"
import styles from "../styles/appStyles"
import { io } from 'socket.io-client'
import Copyright from "./Copyright"
import Contact from "./Contact"
import NavBar from "./Navbar"
import Posts from "./Posts"
import Home from "./Home"
import Chat from "./Chat"

////// socket test
const socket = io('http://localhost:5000')

socket.on('connect', () => {
	console.log("socket id from App component: ", socket.id)
})

socket.emit('custom-event', "test message", 10, [1, 2, 3])
////// socket test


// const deletePost = async (_id) => {
// 	try {
// 		await fetch(`http://localhost:5000/api/posts/delete/${_id}`, { method: 'POST' })
// 		return true
// 	} catch (err) { return false }
// }

function chatReducer(state, { messages, chatData, chat, user, sender_id, type }) {
	switch (type) {
		case 'load':
			console.log('data from reducer: ', chatData)
			return chatData
		// case 'load':
		// 	return chat.find(sender => sender.some(message => message['sender_id'] == sender_id))
		default: return state
	}
}

function postReducer(state, { posts, data, user, _id, type }) {
	switch (type) {
		case 'like':
			return state.map(post => {
				if (post['_id'] == _id) {
					if (post.likes.includes(user['id'])) return post
					const postLikes = [...post.likes, user['_id']]
					return { ...post, likes: postLikes }
				}
				return post
			})
		case 'unlike':
			return state.map(post => {
				if (post['_id'] == _id) {
					const reducedLikes = post.likes.filter(likeId => likeId !== user['_id'])
					return { ...post, likes: reducedLikes }
				}
				return post
			})
		case 'delete':
			return state.filter(post => post['_id'] !== _id)
		case 'add':
			const newState = [data, ...state]
			//console.log('data after "add" reducer: ', data)
			return newState // TODO: first figure out the response and then get back here.
		case 'edit':
			return state.map(post => post['_id'] == _id ? data : post)
		case 'load':
			return posts
		default: return state
	}
}

const formViewReducer = (state, { formName, _id }) => {
	switch (formName) {
		case "login":
			return ({ login: true, signup: false })
		case "signup":
			return ({ signup: true, login: false })
		case "post":
			return ({ ...state, post: true })
		case "edit":
			return ({ edit: { view: true, _id } })
		case "overlay":
			return ({ signup: false, login: false, post: false, edit: false })
		default:
			return state
	}
}

const App = () => {

	const fetchUser = async () => {
		const data = await fetch('http://localhost:5000/api/users/user')
		const user = await data.json()
		console.log("Fetched User: ", user)
		setUser(user)
	}

	const fetchPosts = async () => {
		const data = await fetch('http://localhost:5000/api/posts')
		const items = await data.json()
		setPosts({ posts: items.posts, type: 'load' })
	}

	const fetchChat = async () => {
		const data = await fetch('http://localhost:5000/api/chats')
		const chatData = await data.json()
		setChat({ chatData, type: 'load' })
		console.log("LOADED CHAT: ", chatData)
	}

	const [user, setUser] = useState([])
	const [posts, setPosts] = useReducer(postReducer, [])
	const [chat, setChat] = useReducer(chatReducer, [])
	const [formView, setFormView] = useReducer(formViewReducer, {
		login: false,
		signup: false,
		post: false,
		edit: { view: false, _id: null },
		overlay: false
	})

	useEffect(() => { fetchUser(); fetchPosts(); fetchChat() }, [])

	const classes = styles()
	return (
		<div className={classes.app}>

			<HandlerContext.Provider

				value={{
					user,
					setUser,
					posts,
					setPosts,
					fetchUser,
					formView,
					setFormView,
					chat
				}}>

				<NavBar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/posts" element={<Posts />} />
					<Route path="/chat" element={<Chat />} />
					<Route path="/contact" element={<Contact />} />
				</Routes>
				<Copyright />

			</HandlerContext.Provider>
		</div>
	)
}

export default App