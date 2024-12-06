import { ResId } from "@/api/schemas/inferred/common";
import UserAvatarPhoto from "@/components/shared/UserAvatarPhoto";
import useReplyForm from "@/services/hook/feed/useReplyForm";
import styles from "@/styles/feed/commentReplyFormStyles";
import { ConsumerFn } from "@/types/genericTypes";
import EmojiInput from "@shared/EmojiInput";
import FlexStyled from "@shared/FlexStyled";
import FormStyled from "@shared/FormStyled";

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