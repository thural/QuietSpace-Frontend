import { User } from "@/api/schemas/inferred/user";
import { ResId } from "@/api/schemas/native/common";
import { usePostComment } from "@/hooks/data/useCommentData";
import { ConsumerFn } from "@/types/genericTypes";
import { nullishValidationdError } from "@/utils/errorUtils";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";

const useReplyForm = (postId: ResId, parentId: ResId, toggleView: ConsumerFn) => {

    const queryClient = useQueryClient();
    const user: User | undefined = queryClient.getQueryData(["user"]);

    if (user === undefined) throw nullishValidationdError({ user });

    const addNewComment = usePostComment(postId);

    const [commentInput, setCommentData] = useState({
        postId: postId,
        userId: user?.id,
        parentId: parentId,
        text: ''
    });

    const cursorPosition = useRef(commentInput.text.length);
    const inputRef = useRef(null);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') toggleView(false);
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.setSelectionRange(cursorPosition.current, cursorPosition.current);
        }
    }, [commentInput.text]);

    const handleEmojiInput = (eventValue: string) => {
        setCommentData({ ...commentInput, text: eventValue });
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