import React, { useState } from "react";
import styles from "./styles/newPostStyles"
import Overlay from "../Overlay"
import { useDispatch } from "react-redux";

const PostForm = () => {

  const dispatch = useDispatch

  const [postData, setPostData] = useState({ text: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setPostData({ ...postData, [name]: value });
  }

  const addPost = async (postData) => {
    try {
      await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(postData)
      })
        .then(res => res.json(), err => console.log('error from add post: ', err))
        .then(data => {
          dispatch({ type: 'addPost', payload: { data } })
        })
    } catch (err) { throw err }
  }

  const classes = styles()
  
  return (
    <>
      <Overlay />

      <div className={classes.post}>
        <h3>Create a post</h3>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            addPost(postData)
            dispatch({ type: 'overlay' })
          }}
        >

          <textarea
            className='text area'
            type='text' name='text'
            placeholder="What's on your mind?"
            maxLength="128"
            value={postData.text}
            onChange={handleChange}>
          </textarea>

          <button className="submit-btn" type='submit'> Post </button>
        </form>

      </div>
    </>
  )
}

export default PostForm