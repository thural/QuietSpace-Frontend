import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePostComment } from "../../../hooks/useCommentData";

const useCommentForm = (postId) => {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const addNewComment = usePostComment(postId);

    const [commentInput, setCommentData] = useState({ postId: postId, userId: user?.id, text: '' });
    const cursorPosition = useRef(commentInput.text.length);
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef === null) return;
        if (inputRef.current === null) return;
        inputRef.current.setSelectionRange(cursorPosition.current, cursorPosition.current);
    }, [commentInput.text]);

    const handleEmojiInput = (event) => {
        setCommentData({ ...commentInput, text: event });
    };

    const handleSubmit = () => {
        addNewComment.mutate(commentInput);
    };

    return {
        commentInput,
        handleEmojiInput,
        handleSubmit,
        inputRef,
    };
};

export default useCommentForm;