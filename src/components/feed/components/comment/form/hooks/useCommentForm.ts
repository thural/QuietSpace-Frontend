import { UserSchema } from "@/api/schemas/user";
import { usePostComment } from "@/hooks/useCommentData";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

const useCommentForm = (postId: string | number) => {
    const queryClient = useQueryClient();
    const signedUser: UserSchema | undefined = queryClient.getQueryData(["user"]);
    const addNewComment = usePostComment(postId);

    if (signedUser === undefined) throw new Error("(!) can't input comment data: user is undefined");

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