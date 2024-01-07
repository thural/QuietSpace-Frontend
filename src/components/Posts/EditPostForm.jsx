import React, { useState } from "react"
import styles from "./styles/editPostStyles"
import Overlay from "../Overlay"
import { useDispatch, useSelector } from "react-redux"
import { editPost } from "../../redux/postReducer"
import { edit } from "../../redux/formViewReducer"
import { fetchEditPost } from "../../api/postRequests"
import { POST_URL } from "../../constants/ApiPath"

const EditPostForm = () => {

  const dispatch = useDispatch();
  const auth = useSelector(state => state.authReducer);
  const posts = useSelector(state => state.postReducer);
  const { edit: editView } = useSelector(state => state.formViewReducer);

  const postId = editView["_id"];
  const editedPost = posts.find(post => post.id === postId);
  const [postData, setPostData] = useState(editedPost);

  const handleChange = (event) => {
    const { name, value } = event.target
    setPostData({ ...postData, [name]: value })
  }

    const handleEditPost = async (postData, postId) => {
      try {
        const response = await fetchEditPost(POST_URL, postData, auth.token, postId);
        if (response.ok) dispatch(editPost(postData));
      } catch (error) {
        console.log('error message from edit POST: ', error);
      }
    }

  const handleSubmit = (event) => {
    event.preventDefault();
    handleEditPost(postData, postId);
    dispatch(edit({ view: false, _id: postId }))
  }

  const classes = styles();

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

export default EditPostForm