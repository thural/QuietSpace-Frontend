import useUserQueries from "@/api/queries/userQueries";
import { ResId } from "@/api/schemas/inferred/common";
import { usePostComment } from "@/services/data/useCommentData";
import { ConsumerFn } from "@/types/genericTypes";
import { useEffect, useRef, useState } from "react";

const useCommentForm = (postId: ResId, onClose?: ConsumerFn) => {

    const { getSignedUserElseThrow } = useUserQueries();
    const signedUser = getSignedUserElseThrow();
    const addNewComment = usePostComment(postId, onClose);

    const [commentInput, setCommentData] = useState({ postId: postId, userId: signedUser.id, text: '' });
    const cursorPosition = useRef(commentInput.text.length);
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef === null || inputRef.current === null) return;
        inputRef.current.setSelectionRange(cursorPosition.current, cursorPosition.current);
    }, [commentInput.text]);

    const handleEmojiInput = (inputText: string) => {
        setCommentData({ ...commentInput, text: inputText });
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