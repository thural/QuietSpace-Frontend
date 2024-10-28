import BoxStyled from "@/components/shared/BoxStyled";
import FormStyled from "@/components/shared/FormStyled";
import Typography from "@/components/shared/Typography";
import DarkButton from "@/components/shared/buttons/DarkButton ";
import useEditPostForm from "./hooks/useEditPostForm";
import styles from "./styles/editPostStyles";
import { ResId } from "@/api/schemas/inferred/common";

const EditPostForm = ({ postId }: { postId: ResId }) => {
  const classes = styles();
  const {
    postData,
    handleSubmit,
    handleChange,
  } = useEditPostForm(postId);

  return (
    <>
      <BoxStyled className={classes.post}>
        <Typography type="h3">edit post</Typography>
        <FormStyled>
          <textarea
            className='text input'
            name='text'
            placeholder="text"
            maxLength={128}
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