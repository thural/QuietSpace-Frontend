import React, { useContext, useState } from "react";
import CardBoard from "./CardBoard";
import PostsContext from "./PostsContext";
import HandlerContext from "./HandlersContext"
import styles from "../styles/postsStyles"

const Posts = () => {
  const { user } = useContext(PostsContext);
  const { setPosts } = useContext(HandlerContext);
  const classes = styles();

  const [postData, setPostData] = useState({ message: '' })

  const handleChange = (event) => {
    setPostData({ ...postData, [event.target.name]: event.target.value });
  }

  const addPost = async (postData) => {
    try {
      await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(postData)
      })
        .then(res => res.json(), err => console.log('error message: ', err))
        .then(response => {
          console.log('message: ', response);
          setPosts({ type: 'add', response })
        })
    } catch (err) { throw err }
  }

  return (
    <div className={classes.posts}>
      {user.username &&
        <div>
          <h3>Create a post</h3>
          <form onSubmit={(e) => { e.preventDefault(); addPost(postData) }}>
            <input className='message input'
              type='text' name='message'
              placeholder="message" maxLength="64"
              value={postData.message} onChange={handleChange}
            ></input>
            <button className="submit-btn" type='submit'> Submit </button>
          </form>
        </div>
      }
      <CardBoard />
    </div>
  )
};

export default Posts;
