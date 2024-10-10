import React from "react";
import styles from "./styles/commentSectionStyles";
import InputEmoji from "react-input-emoji";
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
        <form>
            <InputEmoji
                className={classes.commentInput}
                value={commentInput.text}
                onChange={handleEmojiInput}
                fontSize={15}
                cleanOnEnter
                buttonElement
                borderColor="#FFFFFF"
                onEnter={handleSubmit}
                theme="light"
                placeholder="Type a comment"
                inputRef={inputRef}
            />
        </form>
    );
};

export default CommentForm;