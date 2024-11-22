import { getSignedUserElseThrow } from "@/api/queries/userQueries";
import { ResId } from "@/api/schemas/native/common";
import { usePostComment } from "@/services/data/useCommentData";
import { ConsumerFn } from "@/types/genericTypes";
import React, { useEffect, useRef, useState } from "react";

const useReplyForm = (postId: ResId, parentId: ResId, toggleView: ConsumerFn) => {

    const user = getSignedUserElseThrow();

    const [commentInput, setCommentData] = useState({
        postId: postId,
        userId: user?.id,
        parentId: parentId,
        text: ''
    });

    const cursorPosition = useRef(commentInput.text.length);
    const inputRef = useRef(null);
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.setSelectionRange(cursorPosition.current, cursorPosition.current);
        }
    }, [commentInput.text]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') toggleView(false);
    };

    const handleEmojiInput = (eventValue: string) => {
        setCommentData({ ...commentInput, text: eventValue });
    };

    const addNewComment = usePostComment(postId);
    const handleSubmit = () => {
        addNewComment.mutate(commentInput);
    };

    return {
        user,
        commentInput,
        setCommentData,
        handleKeyDown,
        handleEmojiInput,
        handleSubmit,
        inputRef
    };
};

export default useReplyForm;