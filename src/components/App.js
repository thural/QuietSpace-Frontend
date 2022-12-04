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

function postReducer(state, { posts, response: data, user, _id, type }) {
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
			const newState = [...state, data]
			//console.log('newState in "add" reducer: ', newState)
			return newState // TODO: first figure out the response and then get back here.
		case 'load':
			return posts
		default: return state
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

	const [formView, setFormView] = useState({
		login: false,
		signup: false,
		post: false,
		edit: { view: false, id: null },
		overlay: false
	})

	const toggleComponent = ({ formName, _id }) => {
		switch (formName) {
			case "login":
				setFormView({ login: true, signup: false })
				break;
			case "signup":
				setFormView({ signup: true, login: false })
				break;
			case "post":
				setFormView({...formView, post: true })
				break;
			case "edit":
				setFormView({ edit: { view: true, _id } })
				break;
			case "overlay":
				setFormView({ signup: false, login: false, post: false, edit: false })
				break
			default:
				null
		}
	}

	const [posts, setPosts] = useReducer(postReducer, []);
	const [user, setUser] = useState([]);

	useEffect(() => { fetchPosts(), fetchUser() }, []);

	const classes = styles();

	return (
		<div className={classes.app}>
			<PostsContext.Provider value={{ posts, user, formView }}>
				<HandlerContext.Provider value={{ setPosts, setUser, fetchUser, toggleComponent }}>
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