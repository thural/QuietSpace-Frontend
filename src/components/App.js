import React, { useReducer, useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import MainContext from "./MainContext"
import styles from "../styles/appStyles"
//import { io } from 'socket.io-client'
import Contact from "./Contact/Contact"
import NavBar from "./Navbar/Navbar"
import Posts from "./Posts/Posts"
import Home from "./Home/Home"
import Chat from "./Chat/Chat"

import { useSelector, useDispatch } from 'react-redux'

// ////// socket test
// const socket = io('http://localhost:5000')

// socket.on('connect', () => {
// 	console.log("socket id from App component: ", socket.id)
// })

// socket.emit('custom-event', "test message", 10, [1, 2, 3])
// ////// socket test


// const deletePost = async (_id) => {
// 	try {
// 		await fetch(`http://localhost:5000/api/posts/delete/${_id}`, { method: 'POST' })
// 		return true
// 	} catch (err) { return false }
// }

const App = () => {
  const chatFromStore = useSelector(state => state.chatReducer)
  const postsFromStore = useSelector(state => state.postReducer)
  const currentUser = useSelector(state => state.userReducer)
  const dispatch = useDispatch()

  const fetchUser = async () => {
    const data = await fetch('http://localhost:5000/api/users/user')
    const user = await data.json()
    dispatch({ type: 'loadUser', payload: { user } })
  }

  const fetchPosts = async () => {
    const data = await fetch('http://localhost:5000/api/posts')
    const items = await data.json()
    console.log('post items', items)
    dispatch({ type: 'loadPosts', payload: { posts: items.posts } })
  }

  const fetchChat = async () => {
    const data = await fetch('http://localhost:5000/api/chats')
    const chatData = await data.json()
    dispatch({ type: 'load', payload: { chatData } })
  }

  useEffect(() => {
    fetchUser().then(fetchPosts(), fetchChat())
  }, [])

  const classes = styles()
  return (
    <div className={classes.app}>
      <MainContext.Provider
        value={{
          fetchUser,
          fetchPosts,
          fetchChat,
        }}>

        <NavBar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

      </MainContext.Provider>
    </div>
  )
}

export default App