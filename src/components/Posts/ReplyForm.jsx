import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/commentReplyStyles";
import InputEmoji from "react-input-emoji";
import { useQueryClient } from "@tanstack/react-query";
import { usePostComment } from "../../hooks/useCommentData";


const ReplyForm = ({ postId, parentId, toggleView }) => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const addNewComment = usePostComment(postId);

    const [commentInput, setCommentData] = useState({
        postId: postId,
        userId: user?.id,
        parentId: parentId,
        text: ''
    });

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') toggleView(false);
    }

    const cursorPosition = useRef(commentInput.text.length);
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef === null) return;
        if (inputRef.current === null) return;
        inputRef.current.setSelectionRange(cursorPosition.current, cursorPosition.current);
    }, [commentInput.text]);


    const handleEmojiInput = (event) => {
        setCommentData({ ...commentInput, text: event })
    }

    const handleSubmit = () => {
        addNewComment.mutate(commentInput);
    }

    const classes = styles();

    return (
            <form className={classes.wrapper}>
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
                    placeholder="Type a comment"
                />
            </form>
    )
}

export default ReplyForm