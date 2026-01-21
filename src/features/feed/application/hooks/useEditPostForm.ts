import useUserQueries from "@features/profile/data/userQueries";
import { ResId } from "@/shared/api/models/common";
import { PollRequest, PostRequest } from "@/features/feed/data/models/post";
import { useEditPost, useGetPostById } from "@features/feed/data";
import { ConsumerFn } from "@/shared/types/genericTypes";
import { toUpperFirstChar } from "@/shared/utils/stringUtils";
import { useState } from "react";

/**
 * Custom hook for managing the state and logic of an edit post form.
 *
 * This hook retrieves the current post data for editing, initializes the form state,
 * and provides handlers for input changes and form submission.
 *
 * @param {ResId} postId - The ID of the post to be edited.
 * @param {ConsumerFn} toggleForm - Function to toggle the visibility of the form.
 * @returns {{
 *     postData: PostRequest,                          // The current state of the post data for editing.
 *     isError: boolean,                               // Indicates if there was an error fetching the post.
 *     isLoading: boolean,                             // Indicates if the post data is currently loading.
 *     editCurrentPost: object,                        // Object containing the mutation function for editing the post.
 *     handleSubmit: (event: Event) => void,          // Handler for submitting the edited post.
 *     handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void // Handler for input changes.
 *     signedUser: object,                             // The signed-in user object.
 *     avatarPlaceholder: string                       // Placeholder for the user's avatar.
 * }} - An object containing the edit post form state and handler functions.
 */
const useEditPostForm = (postId: ResId, toggleForm: ConsumerFn) => {
    const { data: editedPost, isLoading, isError } = useGetPostById(postId);
    if (editedPost === undefined) throw new Error("editedPost is undefined");

    const pollData: PollRequest | null = editedPost.poll ? {
        options: editedPost.poll.options.map(option => option.label),
        dueDate: editedPost.poll.dueDate
    } : null;

    const requestBody: PostRequest = {
        title: editedPost.title,
        text: editedPost.text,
        userId: editedPost.userId,
        poll: pollData,
        viewAccess: "anyone"
    };

    const [postData, setPostData] = useState<PostRequest>(requestBody);
    const editCurrentPost = useEditPost(postId, toggleForm);

    const handleSubmit = (event: Event) => {
        event.preventDefault();
        editCurrentPost.mutate(postData);
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setPostData({ ...postData, [name]: value });
    };

    const { getSignedUserElseThrow } = useUserQueries();
    const signedUser = getSignedUserElseThrow();
    const avatarPlaceholder = toUpperFirstChar(signedUser.username);

    return {
        postData,
        isError,
        isLoading,
        editCurrentPost,
        handleSubmit,
        handleChange,
        signedUser,
        avatarPlaceholder
    };
};

export default useEditPostForm;