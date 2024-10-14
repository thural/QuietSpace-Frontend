import React from "react";
import BoxStyled from "../Shared/BoxStyled";
import FormStyled from "../Shared/FormStyled";
import Overlay from "../Shared/Overlay";
import Typography from "../Shared/Typography";
import DarkButton from "../Shared/buttons/DarkButton ";
import useEditPostForm from "./hooks/useEditPostForm";
import styles from "./styles/editPostStyles";

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
      <BoxStyled className={classes.post}>
        <Typography type="h3">edit post</Typography>
        <FormStyled>
          <textarea
            className='text input'
            name='text'
            placeholder="text"
            maxLength="128"
            value={postData["text"]}
            onChange={handleChange}>
          </textarea>
          <DarkButton className="submit-btn" type='button' onClick={handleSubmit} />
        </FormStyled>
      </BoxStyled>
    </>
  );
};

export default EditPostForm;