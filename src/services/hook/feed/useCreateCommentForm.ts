import { getSignedUserElseThrow } from "@/api/queries/userQueries";
import { CommentResponse } from "@/api/schemas/inferred/comment";
import { PostResponse } from "@/api/schemas/inferred/post";
import { usePostComment } from "@/services/data/useCommentData";
import { ConsumerFn } from "@/types/genericTypes";
import { toUpperFirstChar } from "@/utils/stringUtils";
import { isComment } from "@/utils/typeUtils";
import { useEffect, useRef, useState } from "react";


const useCreateCommentForm = (postItem: PostResponse | CommentResponse, handleClose?: ConsumerFn) => {

    const signedUser = getSignedUserElseThrow();
    let initState = undefined;

    if (isComment(postItem)) {
        initState = { postId: postItem.postId, parentId: postItem.id, userId: signedUser.id, text: '' };
    } else initState = { postId: postItem.id, userId: signedUser.id, text: '' };


    const [commentData, setCommentData] = useState(initState);

    const inputRef = useRef(null);
    const cursorPosition = useRef(commentData.text.length);
    useEffect(() => {
        if (inputRef === null || inputRef.current === null) return;
        inputRef.current.setSelectionRange(cursorPosition.current, cursorPosition.current);
    }, [commentData.text]);


    const handleChange = (inputText: string) => {
        setCommentData({ ...commentData, text: inputText });
    };

    const addComment = usePostComment(postItem.id, handleClose);
    const handleSubmit = () => addComment.mutate(commentData);

    const userAvatarPlaceholder = toUpperFirstChar(signedUser.username);
    const authorAvatarPlaceholder = toUpperFirstChar(postItem.username);

    const inputValue = commentData.text;

    return {
        inputRef,
        inputValue,
        addComment,
        commentData,
        handleChange,
        handleSubmit,
        userId: signedUser.id,
        authorId: postItem.userId,
        userAvatarPlaceholder,
        authorAvatarPlaceholder,
    };
};

export default useCreateCommentForm;