import { ResId } from "@/api/schemas/inferred/common";
import FormStyled from "@/components/shared/FormStyled";
import ModalStyled from "@/components/shared/ModalStyled";
import TextAreaStyled from "@/components/shared/TextAreaStyled";
import Typography from "@/components/shared/Typography";
import DarkButton from "@/components/shared/buttons/DarkButton";
import useEditCommentForm from "@/services/hook/feed/useEditCommentForm";

/**
 * Props for the EditCommentForm component.
 * 
 * @interface EditCommentFormProps
 * @property {ResId} postId - The ID of the post associated with the comment being edited.
 */

/**
 * EditCommentForm component.
 * 
 * This component provides a form for users to edit an existing comment on a post.
 * It includes a textarea for the comment text and a button to submit the changes.
 * The component manages user input and submits the edited comment upon completion.
 * 
 * @param {EditCommentFormProps} props - The component props.
 * @returns {JSX.Element} - The rendered EditCommentForm component.
 */
const EditCommentForm: React.FC<{ postId: ResId }> = ({ postId }) => {
  const {
    postData,
    handleSubmit,
    handleChange,
  } = useEditCommentForm(postId);

  return (
    <ModalStyled>
      <Typography type="h3">Edit Post</Typography>
      <FormStyled>
        <TextAreaStyled
          name='text'
          placeholder="text"
          maxLength={128}
          value={postData.text}
          handleChange={handleChange}
        />
        <DarkButton className="submit-btn" type='button' onClick={handleSubmit} />
      </FormStyled>
    </ModalStyled>
  );
};

export default EditCommentForm;