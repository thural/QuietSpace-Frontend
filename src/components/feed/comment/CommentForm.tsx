import useStyles from "@/styles/feed/commentFormStyles";
import useCommentForm from "@/services/hook/feed/useCommentForm";
import FormStyled from "@/components/shared/FormStyled";
import EmojiInput from "@/components/shared/EmojiInput";
import { ResId } from "@/api/schemas/inferred/common";

const CommentForm = ({ postId }: { postId: ResId }) => {

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