import React from "react";
import styles from "./styles/editPostStyles";
import Overlay from "../Overlay/Overlay";
import useEditPostForm from "./hooks/useEditPostForm";

const EditPostForm = ({ postId }) => {
  const classes = styles();
  const {
    postData,
    handleSubmit,
    handleChange,
  } = useEditPostForm(postId);

  return (
    <>
      <Overlay closable={{ editPost: false }} />
      <div className={classes.post}>
        <h3>edit post</h3>
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
  );
};

export default EditPostForm;