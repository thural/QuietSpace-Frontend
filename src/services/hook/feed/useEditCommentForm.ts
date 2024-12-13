import usePostQueries from "@/api/queries/usePostQueries";
import { ResId } from "@/api/schemas/inferred/common";
import { PollRequest, PostRequest, PostResponse } from "@/api/schemas/inferred/post";
import { useEditPost } from "@/services/data/usePostData";
import { assertIsNotUndefined } from "@/utils/assertions";
import { useState } from "react";

/**
 * Custom hook for managing the state and logic of an edit comment form.
 *
 * This hook retrieves the current post data for editing, initializes the form state,
 * and provides handlers for input changes and form submission.
 *
 * @param {ResId} postId - The ID of the post to be edited.
 * @returns {{
 *     postData: PostRequest,                          // The current state of the post data for editing.
 *     handleSubmit: (event: Event) => void,          // Handler for submitting the edited post.
 *     handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void // Handler for input changes.
 * }} - An object containing the edit comment form state and handler functions.
 */
const useEditCommentForm = (postId: ResId) => {
    const { getPostById, getPosts } = usePostQueries();
    const posts = getPosts();
    assertIsNotUndefined({ posts });

    const editedPost: PostResponse | undefined = getPostById(postId);
    if (editedPost === undefined) throw new Error("editedPost is undefined");

    const pollData: PollRequest = {
        options: editedPost.poll.options.map(option => option.label),
        dueDate: editedPost.poll.dueDate
    };

    const requestBody: PostRequest = {
        text: editedPost.text,
        userId: editedPost.userId,
        poll: pollData,
        viewAccess: "anyone"
    };

    const [postData, setPostData] = useState<PostRequest>(requestBody);
    const editCurrentPost = useEditPost(postId, () => console.log("Post edit initiated"));

    const handleSubmit = (event: Event) => {
        event.preventDefault();
        editCurrentPost.mutate(postData);
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setPostData({ ...postData, [name]: value });
    };

    return {
        postData,
        handleSubmit,
        handleChange,
    };
};

export default useEditCommentForm;