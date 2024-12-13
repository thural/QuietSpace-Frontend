import useStyles from "@/styles/feed/commentFormStyles";
import useCommentForm from "@/services/hook/feed/useCommentForm";
import FormStyled from "@/components/shared/FormStyled";
import EmojiInput from "@/components/shared/EmojiInput";
import { ResId } from "@/api/schemas/inferred/common";

/**
 * Props for the CommentForm component.
 *
 * @interface CommentFormProps
 * @property {ResId} postId - The ID of the post to which the comment is being made.
 */
interface CommentFormProps {
    postId: ResId;
}

/**
 * CommentForm component that allows users to input and submit comments with emoji support.
 *
 * @param {CommentFormProps} props - The props for the CommentForm component.
 * @returns {JSX.Element} - The rendered comment form component.
 */
const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
    const classes = useStyles();

    const {
        commentInput,
        handleEmojiInput,
        handleSubmit,
        inputRef,
    } = useCommentForm(postId);

    return (
        <FormStyled>
            <EmojiInput
                className={classes.commentInput}
                value={commentInput.text}
                onChange={handleEmojiInput}
                cleanOnEnter
                buttonElement
                onEnter={handleSubmit}
                placeholder="type a comment"
                inputRef={inputRef}
            />
        </FormStyled>
    );
};

export default CommentForm;