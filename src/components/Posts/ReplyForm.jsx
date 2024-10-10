import React from "react";
import styles from "./styles/commentReplyStyles";
import InputEmoji from "react-input-emoji";
import { Flex } from "@mantine/core";
import { toUpperFirstChar } from "../../utils/stringUtils";
import UserAvatar from "../Shared/UserAvatar";
import useReplyForm from "./hooks/useReplyForm";

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
        <Flex className={classes.container}>
            <UserAvatar size="1.5rem" chars={toUpperFirstChar(user.username)} />
            <form className={classes.inputWrapper}>
                <InputEmoji
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
            </form>
        </Flex>
    );
};

export default ReplyForm;