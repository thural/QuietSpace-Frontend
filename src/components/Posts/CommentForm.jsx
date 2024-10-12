import React from "react";
import EmojiInput from "../Shared/EmojiInput";
import FormStyled from "../Shared/Form";
import useCommentForm from "./hooks/useCommentForm";
import styles from "./styles/commentSectionStyles";

const CommentForm = ({ postId }) => {

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