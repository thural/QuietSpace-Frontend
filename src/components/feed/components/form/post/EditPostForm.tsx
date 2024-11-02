import BoxStyled from "@/components/shared/BoxStyled";
import FormStyled from "@/components/shared/FormStyled";
import Typography from "@/components/shared/Typography";
import DarkButton from "@/components/shared/buttons/DarkButton ";
import useEditPostForm from "./hooks/useEditPostForm";
import styles from "./styles/editPostStyles";
import { ResId } from "@/api/schemas/inferred/common";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";
import { ConsumerFn } from "@/types/genericTypes";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";

interface EditPostFormProps extends GenericWrapper {
  postId: ResId,
  toggleForm: ConsumerFn
}

const EditPostForm: React.FC<EditPostFormProps> = ({ postId, toggleForm }) => {

  const classes = styles();

  let data = undefined;

  try {
    data = useEditPostForm(postId, toggleForm);
  } catch (error) {
    return <ErrorComponent message={(error as Error).message} />
  }

  const {
    isError,
    isLoading,
    postData,
    handleSubmit,
    handleChange,
  } = data;


  if (isLoading) return <FullLoadingOverlay />;
  if (isError) return <ErrorComponent message="could not load post" />;


  return (
    <BoxStyled className={classes.post} onClick={(e: Event) => e.stopPropagation()}>
      <Typography type="h3">edit post</Typography>
      <FormStyled>
        <textarea
          name='text'
          placeholder="text"
          maxLength={999}
          value={postData.text}
          onChange={handleChange}>
        </textarea>
        <DarkButton className="submit-btn" type='button' onClick={handleSubmit} />
      </FormStyled>
    </BoxStyled>
  );
};

export default EditPostForm;