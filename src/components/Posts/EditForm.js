import React, { useContext, useState } from "react"
import MainContext from "../MainContext"
import styles from "./styles/newPostStyles"
import Overlay from "../Overlay"

const EditForm = () => {

  const { posts, setPosts, formView, setFormView } = useContext(MainContext)
  const _id = formView.edit["_id"]
  const text = posts.find(post => post["_id"] == _id)["text"]
  const [postData, setPostData] = useState({ "text": text })

  const handleChange = (event) => {
    const { name, value } = event.target
    setPostData({ ...postData, [name]: value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    editPost(postData, _id)
    setFormView({ formName: 'overlay' })
  }

  const editPost = async (postData, _id) => {
    try {
      await fetch(`http://localhost:5000/api/posts/edit/${_id}`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(postData)
      })
        .then(res => res.json(), err => console.log('error message from edit POST: ', err))
        .then(data => {
          setPosts({ type: 'edit', data, _id })
        })
    } catch (err) { throw err }
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