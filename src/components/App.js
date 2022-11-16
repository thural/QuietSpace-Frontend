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
//import Menu from "./Menu"

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

// function postReducer(state, { id, type, item, count }) {
//   const matchesID = (element) => element.id === id;
//   const hasInCart = state.findIndex(matchesID) !== -1;
//   switch (type) {
//     case 'increment':
//       if (hasInCart) return state.map(product => {
//         if (product.id == id) return { ...product, count: product.count + 1 }
//         return product
//       })
//       else return [...state, { ...item, count: 1 }];
//     case 'decrement':
//       if (hasInCart && count > 1) return state.map(product => {
//         if (product.id == id) return { ...product, count: product.count - 1 }
//         return product
//       });
//       return state.filter(product => product.id !== id);
//     case 'remove':
//       return state.filter(product => product.id !== id);
//     default: return state
//   }
// };

const App = () => {
  const fetchPosts = async () => {
    const data = await fetch('http://localhost:5000/api/messages');
    const items = await data.json();
    setPosts(items.messages);
  };

  //const [post, setPost] = useReducer(postReducer, []);

  const [posts, setPosts] = useState([]);

  useEffect(() => { fetchPosts() }, []);

  console.log(posts)//log

  const classes = useStyles();

  return (
    <div className={classes.app}>
      <PostsContext.Provider value={posts}>
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