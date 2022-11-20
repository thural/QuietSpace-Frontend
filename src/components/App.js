import React, { useState, useReducer, useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import { createUseStyles } from "react-jss"
import HandlerContext from "./HandlersContext"
import Posts from "./Posts"
import Copyright from "./Copyright"
import PostsContext from "./PostsContext"
import Contact from "./Contact"
import NavBar from "./Navbar"
import Home from "./Home"

const useStyles = createUseStyles(
  {
    app: {
      margin: '0',
      padding: '0',
      minWidth: '100%',
      minHeight: '100vh',
      position: 'relative',
      backgroundColor: 'whitesmoke',
    }
  }
);

function userReducer(state, { user, type }) {
  switch (type) {
    case 'login':
      return state.map(post => {
        if (post['_id'] == _id) {
          if (post.likes.includes(user['id'])) return post
          const postLikes = [...post.likes, user['_id']]
          return { ...post, likes: postLikes }
        }
        return post
      });
    case 'logout':
      return state.map(post => {
        if (post['_id'] == _id) {
          const reducedLikes = post.likes.filter(likeId => likeId !== user['_id'])
          return { ...post, likes: reducedLikes }
        }
        return post
      })
    case 'signup':
      return state.filter(post => post['_id'] !== _id);
    case 'load':
      return posts
    default: return state
  }
};

function postReducer(state, { posts, user, _id, type }) {
  switch (type) {
    case 'like':
      return state.map(post => {
        if (post['_id'] == _id) {
          if (post.likes.includes(user['id'])) return post
          const postLikes = [...post.likes, user['_id']]
          return { ...post, likes: postLikes }
        }
        return post
      });
    case 'unlike':
      return state.map(post => {
        if (post['_id'] == _id) {
          const reducedLikes = post.likes.filter(likeId => likeId !== user['_id'])
          return { ...post, likes: reducedLikes }
        }
        return post
      })
    case 'delete':
      return state.filter(post => post['_id'] !== _id);
    case 'load':
      return posts
    default: return state
  }
};

const App = () => {
  const fetchPosts = async () => {
    const data = await fetch('http://localhost:5000/api/messages');
    const items = await data.json();
    setPosts({posts:items.messages, type:'load'});
  };

  const fetchUser = async () => {
    const data = await fetch('http://localhost:5000/api/users/user');
    const item = await data.json();
    setUser(item);
  };

  //const [post, setPost] = useReducer(postReducer, []);

  const [posts, setPosts] = useReducer(postReducer, []);
  const [user, setUser] = useState([]);

  useEffect(() => { fetchPosts(), fetchUser() }, []);

  console.log("CURRENT USER: ", user)//log

  const classes = useStyles();

  return (
    <div className={classes.app}>
      <PostsContext.Provider value={{posts, user}}>
        <HandlerContext.Provider value={setPosts}>
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