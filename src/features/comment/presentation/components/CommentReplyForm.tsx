import { ResId } from "@/shared/api/models/common";
import UserAvatarPhoto from "@/shared/UserAvatarPhoto";
import useReplyForm from "@features/feed/application/hooks/useReplyForm";
import styles from "./styles/commentReplyFormStyles";
import { ConsumerFn } from "@/shared/types/genericTypes";
import EmojiInput from "@shared/EmojiInput";
import FlexStyled from "@shared/FlexStyled";
import FormStyled from "@shared/FormStyled";

/**
 * Props for the CommentReplyForm component.
 *
 * @interface CommentReplyFormProps
 * @property {ResId} postId - The ID of the post to which the reply is being made.
 * @property {ResId} parentId - The ID of the parent comment being replied to.
 * @property {ConsumerFn} toggleView - Function to toggle the visibility of the reply form.
 */
interface CommentReplyFormProps {
    postId: ResId;
    parentId: ResId;
    toggleView: ConsumerFn;
}

/**
 * CommentReplyForm component that allows users to input and submit a reply to a comment.
 *
 * This component uses the `useReplyForm` hook to manage the reply input state and submission logic.
 *
 * @param {CommentReplyFormProps} props - The props for the CommentReplyForm component.
 * @returns {JSX.Element} - The rendered reply form component.
 */
const CommentReplyForm: React.FC<CommentReplyFormProps> = ({ postId, parentId, toggleView }) => {
    const classes = styles();

    const {
        user,
        commentInput,
        handleKeyDown,
        handleEmojiInput,
        handleSubmit,
        inputRef
    } = useReplyForm(postId, parentId, toggleView);

    return (
        <FlexStyled className={classes.wrapper}>
            <UserAvatarPhoto userId={user.id} />
            <FormStyled className={classes.inputWrapper}>
                <EmojiInput
                    className={classes.commentInput}
                    value={commentInput.text}
                    onChange={handleEmojiInput}
                    onKeyDown={handleKeyDown}
                    fontSize={15}
                    cleanOnEnter
                    buttonElement
                    onEnter={handleSubmit}
                    placeholder="type a comment"
                    ref={inputRef}
                />
            </FormStyled>
        </FlexStyled>
    );
};

export default CommentReplyForm;