import { ResId } from "@/api/schemas/inferred/common";
import FormControls from "../fragments/FormControls";
import TextInput from "../fragments/TextInput";
import TitleInput from "../fragments/TitleInput";
import CloseButtonStyled from "@/shared/CloseButtonStyled";
import ErrorComponent from "@/shared/errors/ErrorComponent";
import FormStyled from "@/shared/FormStyled";
import LoaderStyled from "@/shared/LoaderStyled";
import ModalStyled from "@/shared/ModalStyled";
import Typography from "@/shared/Typography";
import UserAvatarPhoto from "@/shared/UserAvatarPhoto";
import useEditPostForm from "@/services/hook/feed/useEditPostForm";
import { ConsumerFn } from "@/types/genericTypes";
import { GenericWrapper } from "@/types/sharedComponentTypes";

/**
 * Props for the EditPostForm component.
 * 
 * @interface EditPostFormProps
 * @extends GenericWrapper
 * @property {ResId} postId - The ID of the post being edited.
 * @property {ConsumerFn} toggleForm - Function to toggle the visibility of the form.
 */
interface EditPostFormProps extends GenericWrapper {
  postId: ResId;
  toggleForm: ConsumerFn;
}

/**
 * EditPostForm component.
 * 
 * This component provides a form for users to edit an existing post.
 * It includes fields for the post title and text, as well as controls for
 * submitting the changes. The component handles loading and error states 
 * during the data fetching process.
 * 
 * @param {EditPostFormProps} props - The component props.
 * @returns {JSX.Element} - The rendered EditPostForm component.
 */
const EditPostForm: React.FC<EditPostFormProps> = ({ postId, toggleForm }) => {
  let data;

  try {
    data = useEditPostForm(postId, toggleForm);
  } catch (error) {
    return <ErrorComponent message={(error as Error).message} />;
  }

  const {
    isError,
    isLoading,
    postData,
    editCurrentPost,
    handleSubmit,
    handleChange,
  } = data;

  if (isLoading) return <LoaderStyled />;
  if (isError) return <ErrorComponent message="Could not load post" />;

  return (
    <ModalStyled onClick={(e: Event) => e.stopPropagation()}>
      <CloseButtonStyled handleToggle={toggleForm} />
      <Typography style={{ alignSelf: "center" }} type="h4">Edit Post</Typography>
      <UserAvatarPhoto userId={postData.userId} />
      <FormStyled>
        <TitleInput value={postData.title} handleChange={handleChange} />
        <TextInput value={postData.text} handleChange={handleChange} />
        <FormControls isLoading={editCurrentPost.isPending} isDisabled={!postData.text} handleSubmit={handleSubmit} />
      </FormStyled>
    </ModalStyled>
  );
};

export default EditPostForm;