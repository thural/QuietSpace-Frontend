import BoxStyled from "@/components/shared/BoxStyled";
import FormStyled from "@/components/shared/FormStyled";
import Typography from "@/components/shared/Typography";
import DarkButton from "@/components/shared/buttons/DarkButton ";
import useEditPostForm from "./hooks/useEditCommentForm";
import styles from "./styles/editPostStyles";
import { ResId } from "@/api/schemas/inferred/common";
import TextAreaStyled from "@/components/shared/TextAreaStyled";

const EditPostForm = ({ postId }: { postId: ResId }) => {
  const classes = styles();
  const {
    postData,
    handleSubmit,
    handleChange,
  } = useEditPostForm(postId);

  return (
    <BoxStyled className={classes.post}>
      <Typography type="h3">edit post</Typography>
      <FormStyled>
        <TextAreaStyled
          className='text input'
          name='text'
          placeholder="text"
          maxLength={128}
          value={postData["text"]}
          handleChange={handleChange}>
        </TextAreaStyled>
        <DarkButton className="submit-btn" type='button' onClick={handleSubmit} />
      </FormStyled>
    </BoxStyled>
  );
};

export default EditPostForm;