import { getSignedUserElseThrow } from "@/api/queries/userQueries";
import { Comment } from "@/api/schemas/inferred/comment";
import { Post } from "@/api/schemas/inferred/post";
import { usePostComment } from "@/services/data/useCommentData";
import { toUpperFirstChar } from "@/utils/stringUtils";
import { useEffect, useRef, useState } from "react";


const useCreateCommentForm = (postItem: Post | Comment) => {

    const signedUser = getSignedUserElseThrow();
    let initState = undefined;


    const isComment = (object: Post | Comment): object is Comment => {
        return "replyCount" in object;
    }

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

    const addComment = usePostComment(postItem.id);
    const handleSubmit = () => addComment.mutate(commentData);

    const userAvatarPlaceholder = toUpperFirstChar(signedUser.username);
    const authorAvatarPlaceholder = toUpperFirstChar(postItem.username);

    return {
        inputRef,
        addComment,
        commentData,
        handleChange,
        handleSubmit,
        userAvatarPlaceholder,
        authorAvatarPlaceholder,
    };
};

export default useCreateCommentForm;