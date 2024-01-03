import React, { useState } from "react";
import styles from "./styles/newPostStyles"
import Overlay from "../Overlay"
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../../redux/postReducer";
import { overlay } from "../../redux/formViewReducer";
import { fetchCreatePost } from "../../api/requestMethods";
import { POST_URL } from "../../constants/ApiPath";

const PostForm = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.authReducer);
  const [postData, setPostData] = useState({ text: '' })

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPostData({ ...postData, [name]: value });
  }

  const handleFetchNewPost = async (postData, token) => {
    try {
      const response = await fetchCreatePost(POST_URL, postData, token);
      const responseData = await response.json();
      console.log(responseData);
      dispatch(addPost(postData));
    } catch (error) { console.log(error) }
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
            handleFetchNewPost(postData, auth.token);
            dispatch(overlay())
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