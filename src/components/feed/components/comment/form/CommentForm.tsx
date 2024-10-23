import styles from "./styles/commentFormStyles";
import useCommentForm from "./hooks/useCommentForm";
import FormStyled from "@/components/shared/FormStyled";
import EmojiInput from "@/components/shared/EmojiInput";
import { ResId } from "@/api/schemas/common";

const CommentForm = ({ postId }: { postId: ResId }) => {

    const classes = styles();

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