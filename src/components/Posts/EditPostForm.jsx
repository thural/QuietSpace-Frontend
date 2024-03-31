import React, { useState } from "react";
import styles from "./styles/editPostStyles";
import Overlay from "../Overlay";
import { useQueryClient } from "@tanstack/react-query";
import { useEditPost } from "../../hooks/useFetchData";

const EditPostForm = ({ postId }) => {

  const queryClient = useQueryClient();
  const posts = queryClient.getQueryData(["posts"]);
  const editedPostData = posts.content.find(post => post.id === postId);

  const [postData, setPostData] = useState(editedPostData);
  const editCurrentPost = useEditPost(postId);


  const handleSubmit = (event) => {
    event.preventDefault();
    editCurrentPost.mutate(postData);
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPostData({ ...postData, [name]: value });
  }

  const classes = styles();

  return (
    <>
      <Overlay closable={{ editPost: false }} />
      <div className={classes.post}>
        <h3>Edit post</h3>
        <form>
          <textarea
            className='text input'
            name='text'
            placeholder="text"
            maxLength="128"
            value={postData["text"]}
            onChange={handleChange}>
          </textarea>
          <button className="submit-btn" type='button' onClick={handleSubmit}> Submit </button>
        </form>
      </div>
    </>
  )
}

export default EditPostForm