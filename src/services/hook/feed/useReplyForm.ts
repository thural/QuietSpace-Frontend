import useUserQueries from "@/api/queries/userQueries";
import { ResId } from "@/api/schemas/native/common";
import { usePostComment } from "@/services/data/useCommentData";
import { ConsumerFn } from "@/types/genericTypes";
import React, { useEffect, useRef, useState } from "react";

/**
 * Custom hook for managing the state and logic of a reply comment form.
 *
 * This hook retrieves the signed-in user, manages the input state for the comment,
 * and provides functions to handle the submission of the comment and keyboard events.
 *
 * @param {ResId} postId - The ID of the post to which the comment is being made.
 * @param {ResId} parentId - The ID of the parent comment (if applicable).
 * @param {ConsumerFn} toggleView - Function to toggle the visibility of the comment form.
 * @returns {{
 *     user: object,                                  // The signed-in user object.
 *     commentInput: { postId: ResId, userId: ResId, parentId: ResId, text: string }, // Current state of the comment input.
 *     setCommentData: React.Dispatch<React.SetStateAction<{ postId: ResId, userId: ResId, parentId: ResId, text: string }>>, // Function to update the comment input state.
 *     handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void, // Handler for keydown events.
 *     handleEmojiInput: (eventValue: string) => void, // Function to handle emoji input in the comment.
 *     handleSubmit: () => void,                       // Function to handle form submission.
 *     inputRef: React.RefObject<HTMLInputElement>     // Ref for the comment input field.
 * }} - An object containing the reply form state and handler functions.
 */
const useReplyForm = (postId: ResId, parentId: ResId, toggleView: ConsumerFn) => {
    const { getSignedUserElseThrow } = useUserQueries();
    const user = getSignedUserElseThrow();

    const [commentInput, setCommentData] = useState({
        postId: postId,
        userId: user?.id,
        parentId: parentId,
        text: ''
    });

    const cursorPosition = useRef(commentInput.text.length);
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.setSelectionRange(cursorPosition.current, cursorPosition.current);
        }
    }, [commentInput.text]);

    /**
     * Handles keydown events for the input.
     *
     * @param {React.KeyboardEvent<HTMLInputElement>} event - The keyboard event.
     */
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') toggleView(false);
    };

    /**
     * Handles input of emojis in the comment.
     *
     * @param {string} eventValue - The emoji string to add to the comment.
     */
    const handleEmojiInput = (eventValue: string) => {
        setCommentData({ ...commentInput, text: eventValue });
    };

    const addNewComment = usePostComment({ postId });

    /**
     * Handles the submission of the comment.
     */
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