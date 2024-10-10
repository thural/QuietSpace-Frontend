import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePostComment } from "../../../hooks/useCommentData";

const useReplyForm = (postId, parentId, toggleView) => {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const addNewComment = usePostComment(postId);

    const [commentInput, setCommentData] = useState({
        postId: postId,
        userId: user?.id,
        parentId: parentId,
        text: ''
    });

    const cursorPosition = useRef(commentInput.text.length);
    const inputRef = useRef(null);

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') toggleView(false);
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.setSelectionRange(cursorPosition.current, cursorPosition.current);
        }
    }, [commentInput.text]);

    const handleEmojiInput = (event) => {
        setCommentData({ ...commentInput, text: event });
    };

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