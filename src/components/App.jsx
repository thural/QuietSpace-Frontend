import { Route, Routes } from "react-router-dom"
import styles from "../styles/appStyles"
import MainContext from "./MainContext"
import Contact from "./Contact/Contact"
import NavBar from "./Navbar/Navbar"
import Posts from "./Posts/Posts"
import { useEffect } from "react"
import Home from "./Home/Home"
import Chat from "./Chat/Chat"
import './App.css'

import { useDispatch } from 'react-redux'
import { loadChat } from "../redux/chatReducer"
import { loadUser } from "../redux/userReducer"
import { loadPosts } from "../redux/postReducer"

// import { io } from 'socket.io-client'
// const socket = io('http://localhost:5000')
// socket.on('connect', () => {
// 	console.log("socket id from App component: ", socket.id)
// })
// socket.emit('custom-event', "test message", 10, [1, 2, 3])

const App = () => {

  const dispatch = useDispatch()

  const fetchUser = async () => {
    try {
      const data = await fetch('http://localhost:5000/api/users/user')
      const user = await data.json()
      dispatch(loadUser({ user }))
    } catch (err) { console.log(err) }
  }

  const fetchPosts = async () => {
    try {
      const data = await fetch('http://localhost:5000/api/posts')
      const items = await data.json()
      dispatch(loadPosts(items))
    } catch (err) { console.log(err) }
  }

  const fetchChat = async () => {
    try {
      const data = await fetch('http://localhost:5000/api/chats')
      const chatData = await data.json()
      dispatch(loadChat({ chatData }))
    } catch (err) { console.log(err) }
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