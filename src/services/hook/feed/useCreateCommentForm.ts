import useUserQueries from "@/api/queries/userQueries";
import { CommentResponse } from "@/api/schemas/inferred/comment";
import { PostResponse } from "@/api/schemas/inferred/post";
import { usePostComment } from "@/services/data/useCommentData";
import { ConsumerFn } from "@/types/genericTypes";
import { toUpperFirstChar } from "@/utils/stringUtils";
import { isComment } from "@/utils/typeUtils";
import { useEffect, useRef, useState } from "react";

/**
 * Custom hook for managing the state and logic of a comment creation form.
 *
 * This hook initializes the comment data based on whether the postItem is a post or a comment,
 * and provides handlers for input changes and comment submission.
 *
 * @param {PostResponse | CommentResponse} postItem - The post or comment item to which the comment is related.
 * @param {ConsumerFn} [handleClose] - Optional callback function to execute when the comment form is closed.
 * @returns {{
 *     inputRef: React.RefObject<HTMLInputElement>,       // Ref to the comment input element.
 *     inputValue: string,                                 // The current value of the comment input.
 *     addComment: object,                                 // Object containing the mutation function for adding a comment.
 *     commentData: { postId: ResId, parentId?: ResId, userId: string, text: string }, // The current state of the comment data.
 *     handleChange: (inputText: string) => void,        // Function to update the comment text.
 *     handleSubmit: () => void,                          // Function to submit the comment.
 *     userId: string,                                    // The ID of the signed-in user.
 *     authorId: string,                                  // The ID of the author of the post or comment.
 *     userAvatarPlaceholder: string,                     // Placeholder for the signed-in user's avatar.
 *     authorAvatarPlaceholder: string                    // Placeholder for the author's avatar.
 * }} - An object containing the comment creation form state and handler functions.
 */
const useCreateCommentForm = (postItem: PostResponse | CommentResponse, handleClose?: ConsumerFn) => {
    const { getSignedUserElseThrow } = useUserQueries();
    const signedUser = getSignedUserElseThrow();
    let initState;

    if (isComment(postItem)) {
        initState = { postId: postItem.postId, parentId: postItem.id, userId: signedUser.id, text: '' };
    } else {
        initState = { postId: postItem.id, userId: signedUser.id, text: '' };
    }

    const [commentData, setCommentData] = useState(initState);
    const inputRef = useRef(null);
    const cursorPosition = useRef(commentData.text.length);

    useEffect(() => {
        if (inputRef.current === null) return;
        inputRef.current.setSelectionRange(cursorPosition.current, cursorPosition.current);
    }, [commentData.text]);

    const handleChange = (inputText: string) => {
        setCommentData({ ...commentData, text: inputText });
    };

    const addComment = usePostComment({ postId: postItem.id, handleClose });
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