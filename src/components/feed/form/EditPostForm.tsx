import { ResId } from "@/api/schemas/inferred/common";
import FormControls from "@/components/feed/fragments/FormControls";
import TextInput from "@/components/feed/fragments/TextInput";
import TitleInput from "@/components/feed/fragments/TitleInput";
import CloseButtonStyled from "@/components/shared/CloseButtonStyled";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import FormStyled from "@/components/shared/FormStyled";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import ModalStyled from "@/components/shared/ModalStyled";
import Typography from "@/components/shared/Typography";
import UserAvatar from "@/components/shared/UserAvatar";
import useEditPostForm from "@/services/hook/feed/useEditPostForm";
import { ConsumerFn } from "@/types/genericTypes";
import { GenericWrapper } from "@/types/sharedComponentTypes";

interface EditPostFormProps extends GenericWrapper {
  postId: ResId,
  toggleForm: ConsumerFn
}

const EditPostForm: React.FC<EditPostFormProps> = ({ postId, toggleForm }) => {

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
    editCurrentPost,
    handleSubmit,
    handleChange,
    avatarPlaceholder
  } = data;


  if (isLoading) return <FullLoadingOverlay />;
  if (isError) return <ErrorComponent message="could not load post" />;


  return (
    <ModalStyled onClick={(e: Event) => e.stopPropagation()}>
      <CloseButtonStyled handleToggle={toggleForm} />
      <Typography style={{ alignSelf: "center" }} type="h4">Edit Post</Typography>
      <UserAvatar radius="10rem" chars={avatarPlaceholder} />
      <FormStyled>
        <TitleInput value={postData.title} handleChange={handleChange} />
        <TextInput value={postData.text} handleChange={handleChange} />
        <FormControls isLoading={editCurrentPost.isPending} isDisabled={!postData.text} handleSubmit={handleSubmit} />
      </FormStyled>
    </ModalStyled>
  );
};

export default EditPostForm;