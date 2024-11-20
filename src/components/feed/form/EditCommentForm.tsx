import { ResId } from "@/api/schemas/inferred/common";
import FormStyled from "@/components/shared/FormStyled";
import ModalStyled from "@/components/shared/ModalStyled";
import TextAreaStyled from "@/components/shared/TextAreaStyled";
import Typography from "@/components/shared/Typography";
import DarkButton from "@/components/shared/buttons/DarkButton ";
import useEditPostForm from "@/services/hook/feed/useEditCommentForm";

const EditPostForm = ({ postId }: { postId: ResId }) => {
  const {
    postData,
    handleSubmit,
    handleChange,
  } = useEditPostForm(postId);

  return (
    <ModalStyled>
      <Typography type="h3">edit post</Typography>
      <FormStyled>
        <TextAreaStyled
          name='text'
          placeholder="text"
          maxLength={128}
          value={postData.text}
          handleChange={handleChange}>
        </TextAreaStyled>
        <DarkButton className="submit-btn" type='button' onClick={handleSubmit} />
      </FormStyled>
    </ModalStyled>
  );
};

export default EditPostForm;