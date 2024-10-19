import EmojiInput from "@shared/EmojiInput";
import FormStyled from "@shared/FormStyled";
import React from "react";
import styles from "./styles/commentFormStyles";
import useCommentForm from "./hooks/useCommentForm";

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