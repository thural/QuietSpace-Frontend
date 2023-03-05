import React, { useState, useReducer, useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import MainContext from "./MainContext"
import styles from "../styles/appStyles"
//import { io } from 'socket.io-client'
import Contact from "./Contact/Contact"
import NavBar from "./Navbar/Navbar"
import Posts from "./Posts/Posts"
import Home from "./Home/Home"
import Chat from "./Chat/Chat"

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

function chatReducer(state, { messageData, chatData, currentChat, type }) {
  switch (type) {
    case 'load':
      return chatData
    case 'addMessage':
      return state.chat.map(contact => {
        if (contact['_id'] == currentChat) {
          contact.messages.push(messageData)
        }
        return contact
      })
    default:
      return state
  }
}

function postReducer(state, { posts, data, user, _id, type, postID, commentID }) {
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
      return newState // TODO: first figure out the response and then get back here.
    case 'edit':
      return state.map(post => post['_id'] == _id ? data : post)
    case 'load':
      return posts
    case 'addComment':
      const id = data['_id']
      return state.map(post => {
        if (post['_id'] == id) post = data;
        return post
      })
    case 'deleteComment':
      return state.map(post => {
        if (post['_id'] == postID) {
          const indexOfComment = post.comments.findIndex(comment => comment['_id'] == commentID)
          if (indexOfComment !== -1) post.comments.splice(indexOfComment, 1)
        }
        return post
      })
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
  }

  const [loggedUser, setUser] = useState([])
  const [posts, setPosts] = useReducer(postReducer, [])
  const [chatData, setChat] = useReducer(chatReducer, [])
  const [formView, setFormView] = useReducer(formViewReducer, {
    login: false,
    signup: false,
    post: false,
    edit: { view: false, _id: null },
    overlay: false
  })

  useEffect(() => {
    fetchUser().then(
      fetchPosts(),
      fetchChat()
    )
  }, [])

  const classes = styles()
  return (
    <div className={classes.app}>
      <MainContext.Provider
        value={{
          loggedUser,
          setUser,
          setChat,
          posts,
          setPosts,
          fetchUser,
          fetchPosts,
          fetchChat,
          formView,
          setFormView,
          chat: chatData.chat
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