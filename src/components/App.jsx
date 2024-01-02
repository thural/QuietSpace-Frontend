import { Route, Routes } from "react-router-dom"
import { POST_URL, USER_URL, USER_PROFILE_URL } from "../constants/ApiPath"
import styles from "../styles/appStyles"
import MainContext from "./MainContext"
import Contact from "./Contact/Contact"
import NavBar from "./Navbar/Navbar"
import Posts from "./Posts/Posts"
import { useEffect } from "react"
import Home from "./Home/Home"
import Chat from "./Chat/Chat"
import './App.css'

import { fetchPosts } from "../api/requestMethods"

import { useDispatch } from 'react-redux'
import { loadChat } from "../redux/chatReducer"
import { loadUser } from "../redux/userReducer"
import { loadPosts } from "../redux/postReducer"

const App = () => {

  const dispatch = useDispatch()

  const fetchUser = async () => {
    try {
      const data = await fetch(USER_PROFILE_URL)
      const user = await data.json()
      dispatch(loadUser({ user }))
    } catch (err) { console.log(err) }
  }


  const fetchChat = async () => {
    try {
      const data = await fetch('http://localhost:5000/api/chats')
      const chatData = await data.json()
      dispatch(loadChat({ chatData }))
    } catch (err) { console.log(err) }
  }

  // useEffect(() => {
  //   fetchUser().then(fetchPosts(), fetchChat())
  // }, [])

  useEffect(() => {
    fetchPosts(POST_URL, null).then(responseData => dispatch(loadPosts({responseData})))
  }, [])

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