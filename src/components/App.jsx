import { useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import MainContext from "./MainContext"
import styles from "../styles/appStyles"
import './App.css'
//import { io } from 'socket.io-client'
import Contact from "./Contact/Contact"
import NavBar from "./Navbar/Navbar"
import Posts from "./Posts/Posts"
import Home from "./Home/Home"
import Chat from "./Chat/Chat"

import { useDispatch } from 'react-redux'
import { loadChat } from "../redux/chatReducer"
import { loadUser } from "../redux/userReducer"
import { loadPosts } from "../redux/postReducer"

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

  const dispatch = useDispatch()

  const fetchUser = async () => {
    const data = await fetch('http://localhost:5000/api/users/user')
    const user = await data.json()
    dispatch(loadUser({ user }))
  }

  const fetchPosts = async () => {
    const data = await fetch('http://localhost:5000/api/posts')
    const items = await data.json()
    dispatch(loadPosts(items))
  }

  const fetchChat = async () => {
    const data = await fetch('http://localhost:5000/api/chats')
    const chatData = await data.json()
    dispatch(loadChat({ chatData }))
  }

  useEffect(() => {
    fetchUser().then(fetchPosts(), fetchChat())
  }, [])

  // useEffect(() => {
  //   Promise.all([fetchUser, fetchPosts, fetchChat]).then((data) =>
  //   ({
  //     first: dispatch(loadUser({ user: data[0] })),
  //     second: dispatch(loadPosts({ posts: data[1].posts })),
  //     third: dispatch(loadChat({ chatData: data[2] }))
  //   })
  //   ).then(console.log)
  // }, [])

  const classes = styles()
  return (
    <div className={classes.app}>
      <MainContext.Provider value={{ fetchUser, fetchPosts, fetchChat }}>

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