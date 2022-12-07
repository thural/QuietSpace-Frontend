import React, { useState, useReducer, useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import HandlerContext from "./HandlersContext"
import PostsContext from "./PostsContext"
import styles from "../styles/appStyles"
import Copyright from "./Copyright"
import Contact from "./Contact"
import NavBar from "./Navbar"
import Posts from "./Posts"
import Home from "./Home"



const deletePost = async (_id) => {
	try {
		await fetch(`http://localhost:5000/api/messages/delete/${_id}`, { method: 'POST' })
		return true
	} catch (err) { return false }
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
			deletePost(_id)
			return state.filter(post => post['_id'] !== _id)
		case 'add':
			const newState = [data, ...state]
			//console.log('data after "add" reducer: ', data)
			return newState // TODO: first figure out the response and then get back here.
		case 'edit':
			return state.map( message => message['_id'] == _id ? data : message )
		case 'load':
			return posts
		default: return state
	}
}

const formViewReducer = (state, { formName, _id }) => {
	switch (formName) {
		case "login":
			return({ login: true, signup: false })
		case "signup":
			return({ signup: true, login: false })
		case "post":
			return({...state, post: true })
		case "edit":
			return({ edit: { view: true, _id } })
		case "overlay":
			return({ signup: false, login: false, post: false, edit: false })
		default:
			return state
	}
}

const App = () => {

	const fetchPosts = async () => {
		const data = await fetch('http://localhost:5000/api/messages')
		const items = await data.json()
		setPosts({ posts: items.messages, type: 'load' })
	}

	const fetchUser = async () => {
		const data = await fetch('http://localhost:5000/api/users/user')
		const item = await data.json()
		console.log("Fetched User: ", item)
		setUser(item)
	}

	const [formView, setFormView] = useReducer(formViewReducer, {
		login: false,
		signup: false,
		post: false,
		edit: { view: false, _id: null },
		overlay: false
	})

	const [posts, setPosts] = useReducer(postReducer, []);
	const [user, setUser] = useState([]);

	useEffect(() => { fetchPosts(), fetchUser() }, []);

	const classes = styles();

	return (
		<div className={classes.app}>
			<PostsContext.Provider value={{ posts, user, formView }}>
				<HandlerContext.Provider value={{ setPosts, setUser, fetchUser, setFormView }}>
					<NavBar />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/posts" element={<Posts />} />
						<Route path="/contact" element={<Contact />} />
					</Routes>
				</HandlerContext.Provider>
			</PostsContext.Provider>
			<Copyright />
		</div>
	)
}

export default App