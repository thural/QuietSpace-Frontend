import useUserQueries from "@/api/queries/userQueries";
import { ResId } from "@/api/schemas/inferred/common";
import { usePostComment } from "@/services/data/useCommentData";
import { ConsumerFn } from "@/types/genericTypes";
import { useEffect, useRef, useState } from "react";

/**
 * Custom hook for managing the state and logic of a comment form.
 *
 * This hook handles the input state for a new comment, including emoji input,
 * and manages the submission of the comment to a specific post.
 *
 * @param {ResId} postId - The ID of the post to which the comment is being added.
 * @param {ConsumerFn} [onClose] - Optional callback function to execute when the comment form is closed.
 * @returns {{
 *     commentInput: { postId: ResId, userId: string, text: string },  // The current state of the comment input.
 *     handleEmojiInput: (inputText: string) => void,                  // Function to update the comment text with emoji input.
 *     handleSubmit: () => void,                                        // Function to submit the comment.
 *     inputRef: React.RefObject<HTMLInputElement>                     // Ref to the comment input element.
 * }} - An object containing the comment form state and handler functions.
 */
const useCommentForm = (postId: ResId, onClose?: ConsumerFn) => {
    const { getSignedUserElseThrow } = useUserQueries();
    const signedUser = getSignedUserElseThrow();
    const addNewComment = usePostComment(postId, onClose);

    const [commentInput, setCommentData] = useState({ postId: postId, userId: signedUser.id, text: '' });
    const cursorPosition = useRef(commentInput.text.length);
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current === null) return;
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