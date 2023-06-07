import React, { useState } from "react"
import styles from "./styles/newPostStyles"
import Overlay from "../Overlay"
import { useDispatch, useSelector } from "react-redux"
import { editPost } from "../../redux/postReducer"
import { edit } from "../../redux/formViewReducer"

const EditForm = () => {

  const dispatch = useDispatch()
  const posts = useSelector(state => state.postReducer)
  const { edit: editView } = useSelector(state => state.formViewReducer)

  const _id = editView["_id"]
  const text = posts.find(post => post["_id"] == _id)["text"]
  const [postData, setPostData] = useState({ "text": text })

  const handleChange = (event) => {
    const { name, value } = event.target
    setPostData({ ...postData, [name]: value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    editPostFetch(postData, _id)
    dispatch(edit({ view: false, _id }))
  }

  const editPostFetch = async (postData, _id) => {
    await fetch(`http://localhost:5000/api/posts/edit/${_id}`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(postData)
    })
      .then(res => res.json())
      .then(data => {
        dispatch(editPost({ data, _id }))
      })
      .catch(err => console.log('error message from edit POST: ', err))
  }

  const classes = styles()
  return (
    <>
      <Overlay />
      <div className={classes.post}>
        <h3>Edit post</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            className='text input'
            type='text'
            name='text'
            placeholder="text"
            maxLength="128"
            value={postData["text"]}
            onChange={handleChange}>
          </textarea>
          <button className="submit-btn" type='submit'> Submit </button>
        </form>
      </div>
    </>
  )
}

export default EditForm