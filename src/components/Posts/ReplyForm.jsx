import EmojiInput from "@shared/EmojiInput";
import FlexStyled from "@shared/FlexStyled";
import FormStyled from "@shared/FormStyled";
import UserAvatar from "@shared/UserAvatar";
import { toUpperFirstChar } from "@utils/stringUtils";
import React from "react";
import useReplyForm from "./hooks/useReplyForm";
import styles from "./styles/commentReplyStyles";

const ReplyForm = ({ postId, parentId, toggleView }) => {
    const classes = styles();
    const {
        user,
        commentInput,
        setCommentData,
        handleKeyDown,
        handleEmojiInput,
        handleSubmit,
        inputRef
    } = useReplyForm(postId, parentId, toggleView);

    return (
        <FlexStyled className={classes.wrapper}>
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

export default ReplyForm;