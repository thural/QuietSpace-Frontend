import { POST_URL, USER_URL, USER_PROFILE_URL } from "../constants/ApiPath"
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

import { fetchPosts, fetchUser } from "../api/requestMethods"

import { useDispatch, useSelector } from 'react-redux'
import { loadChat } from "../redux/chatReducer"
import { loadUser } from "../redux/userReducer"
import { loadPosts } from "../redux/postReducer"

const App = () => {

  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  const handleFetchUser = async () => {
    const userResponseData = await fetchUser(USER_PROFILE_URL, auth.token);
    dispatch(loadUser({ userResponseData }));
  }

  const handlefetchPosts = async () => {
    const responseData = await fetchPosts(POST_URL, token);
    dispatch(loadPosts({responseData}));
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
    handleFetchUser().then(handlefetchPosts())
  }, [auth])

  const classes = styles()

  return (
    <div className={classes.app}>
      <MainContext.Provider value={{ fetchUser: handleFetchUser, fetchPosts, fetchChat }}>
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