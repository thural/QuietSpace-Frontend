import React, { useState } from "react"
import styles from "./styles/editPostStyles"
import Overlay from "../Overlay"
import { useDispatch, useSelector } from "react-redux"
import { fetchEditPost } from "../../api/postRequests"
import { POST_URL } from "../../constants/ApiPath"
import { useMutation, useQueryClient } from "@tanstack/react-query";

const EditPostForm = () => {

  const queryClient = useQueryClient();

  const auth = useSelector(state => state.authReducer);
  const posts = useSelector(state => state.postReducer);
  const { edit: editView } = useSelector(state => state.formViewReducer);

  const postId = editView["id"];
  const editedPost = posts.find(post => post.id === postId);
  const [postData, setPostData] = useState(editedPost);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPostData({ ...postData, [name]: value });
  }

  const editPostMutation = useMutation({
    mutationFn: async (postData) => {
      const response = await fetchEditPost(POST_URL, postData, auth["token"], postId);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      console.log("post edited was success")
    },
    onError: (error, variables, context) => {
      console.log("error on editing post:", error.message)
    }
  })

  const handleSubmit = (event) => {
    event.preventDefault();
    editPostMutation.mutate(postData);
    dispatch(edit({ view: false, id: postId }));
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