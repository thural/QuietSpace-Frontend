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


	const [user, setUser] = useState([]);

	useEffect(() => {fetchUser()}, []);

	const classes = styles();

	return (
		<div className={classes.app}>

			<HandlerContext.Provider value={{ user, setUser, fetchUser, formView, setFormView }}>
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