import EmojiInput from "@shared/EmojiInput";
import FlexStyled from "@shared/FlexStyled";
import FormStyled from "@shared/FormStyled";
import UserAvatar from "@shared/UserAvatar";
import { toUpperFirstChar } from "@utils/stringUtils";
import styles from "@/styles/feed/commentReplyFormStyles";
import useReplyForm from "@/services/hook/feed/useReplyForm";
import { ResId } from "@/api/schemas/inferred/common";
import { ConsumerFn } from "@/types/genericTypes";

interface CommentReplyForm {
    postId: ResId
    parentId: ResId
    toggleView: ConsumerFn
}

const CommentReplyForm: React.FC<CommentReplyForm> = ({ postId, parentId, toggleView }) => {

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
        <FlexStyled className={classes.wrapper} >
            <UserAvatar size="1.5rem" chars={toUpperFirstChar(user.username)} />
            <FormStyled className={classes.inputWrapper}>
                <EmojiInput
                    className={classes.commentInput}
                    value={commentInput.text}
                    onChange={handleEmojiInput}
                    onKeyDown={handleKeyDown}
                    fontSize={15}
                    cleanOnEnter
                    buttonElement
                    borderColor="#FFFFFF"
                    onEnter={handleSubmit}
                    theme="light"
                    placeholder="type a comment"
                    ref={inputRef}
                />
            </FormStyled>
        </FlexStyled>
    );
};

export default CommentReplyForm;