import React, { useState } from "react";
import styles from "./styles/editPostStyles";
import Overlay from "../Overlay";
import { fetchEditPost } from "../../api/postRequests";
import { POST_URL } from "../../constants/ApiPath";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authStore, viewStore } from "../../hooks/zustand";

const EditPostForm = ({ postId }) => {

  const queryClient = useQueryClient();
  const { data: viewData, setViewData } = viewStore();
  const { data: authData } = authStore();
  const posts = queryClient.getQueryData(["posts"]);


  console.log("current post id: ", postId)
  const editedPostData = posts.content.find(post => post.id === postId);
  console.log("posts content", posts.content)


  const [postData, setPostData] = useState(editedPostData);


  const editPostMutation = useMutation({
    mutationFn: async (postData) => {
      const response = await fetchEditPost(POST_URL, postData, authData.token, postId);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"], { exact: true });
      setViewData({ overlay: false, editPost: false })
      console.log("post edited was success");
    },
    onError: (error, variables, context) => {
      console.log("error on editing post:", error.message);
    }
  })

  const handleSubmit = (event) => {
    event.preventDefault();
    editPostMutation.mutate(postData);
    // TODO: add logic to close form on submit
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPostData({ ...postData, [name]: value });
  }

  const classes = styles();

  return (
    <>
      <Overlay />
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