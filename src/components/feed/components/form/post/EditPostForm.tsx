import { ResId } from "@/api/schemas/inferred/common";
import UserCard from "@/components/chat/components/sidebar/query/UserCard";
import BoxStyled from "@/components/shared/BoxStyled";
import DarkButton from "@/components/shared/buttons/DarkButton ";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import FormStyled from "@/components/shared/FormStyled";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import TextInput from "@/components/shared/TextInput";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";
import Typography from "@/components/shared/Typography";
import { ConsumerFn } from "@/types/genericTypes";
import useEditPostForm from "./hooks/useEditPostForm";
import styles from "./styles/editPostStyles";

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
    return <ErrorComponent message={(error as Error).message} />;
  }

  const {
    isError,
    isLoading,
    postData,
    handleSubmit,
    handleChange,
    signedUser,
  } = data;


  if (isLoading) return <FullLoadingOverlay />;
  if (isError) return <ErrorComponent message="could not load post" />;


  return (
    <BoxStyled className={classes.post} onClick={(e: Event) => e.stopPropagation()}>
      <Typography type="h3">Edit Post</Typography>
      <UserCard user={signedUser} />
      <TextInput
        className="title"
        name="title"
        minLength="1"
        maxLength="32"
        value={postData.title}
        placeholder="type a title"
        handleChange={handleChange}
      />
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