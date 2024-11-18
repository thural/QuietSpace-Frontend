import { ResId } from "@/api/schemas/inferred/common";
import DarkButton from "@/components/shared/buttons/DarkButton ";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import FormStyled from "@/components/shared/FormStyled";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import ModalStyled from "@/components/shared/ModalStyled";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";
import Typography from "@/components/shared/Typography";
import UserAvatar from "@/components/shared/UserAvatar";
import { ConsumerFn } from "@/types/genericTypes";
import TextInput from "../../fragments/TextInput";
import TitleInput from "../../fragments/TitleInput";
import useEditPostForm from "./hooks/useEditPostForm";
import CloseButtonStyled from "@/components/shared/CloseButtonStyled";

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
        <DarkButton className="submit-btn" type='button' onClick={handleSubmit} />
      </FormStyled>
    </ModalStyled>
  );
};

export default EditPostForm;