import { toUpperFirstChar } from "@/utils/stringUtils";
import { useEffect, useRef, useState } from "react";
import { Post } from "@/api/schemas/inferred/post";
import { nullishValidationdError } from "@/utils/errorUtils";
import { getSignedUser } from "@/api/queries/userQueries";
import { usePostComment } from "@/services/data/useCommentData";


const useCreateCommentForm = (post: Post) => {

    const signedUser = getSignedUser();
    if (!signedUser) throw nullishValidationdError({ signedUser });
    const [commentData, setCommentData] = useState({ postId: post.id, userId: signedUser.id, text: '' });



    const inputRef = useRef(null);
    const cursorPosition = useRef(commentData.text.length);
    useEffect(() => {
        if (inputRef === null || inputRef.current === null) return;
        inputRef.current.setSelectionRange(cursorPosition.current, cursorPosition.current);
    }, [commentData.text]);



    const handleChange = (inputText: string) => {
        setCommentData({ ...commentData, text: inputText });
    };

    const addComment = usePostComment(post.id);
    const handleSubmit = () => addComment.mutate(commentData);

    const userAvatarPlaceholder = toUpperFirstChar(signedUser.username);
    const authorAvatarPlaceholder = toUpperFirstChar(post.username);

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