import useUserQueries from "@/api/queries/userQueries";
import { PostResponse, RepostRequest } from "@/api/schemas/inferred/post";
import { useCreateRepost } from "@/services/data/usePostData";
import { ConsumerFn } from "@/types/genericTypes";
import { toUpperFirstChar } from "@/utils/stringUtils";
import { useState } from "react";

/**
 * Custom hook for managing the state and logic of a repost creation form.
 *
 * This hook handles the input state for a new repost, including text and the original post ID,
 * and provides handlers for input changes and repost submission.
 *
 * @param {ConsumerFn} toggleForm - Function to toggle the visibility of the form.
 * @param {PostResponse} post - The original post that is being reposted.
 * @returns {{
 *     signedUser: object,                              // The signed-in user object.
 *     avatarPlaceholder: string,                       // Placeholder for the user's avatar.
 *     repostData: RepostRequest,                      // The current state of the repost data.
 *     addRepost: object,                              // Object containing the mutation function for adding a repost.
 *     handleChange: (event: React.ChangeEvent<any>) => void, // Handler for input changes.
 *     handleSubmit: (e: Event) => void                // Handler for submitting the repost.
 * }} - An object containing the repost creation form state and handler functions.
 */
const useCreateRepostForm = (toggleForm: ConsumerFn, post: PostResponse) => {
    const { getSignedUserElseThrow } = useUserQueries();
    const signedUser = getSignedUserElseThrow();

    const [repostData, setRepostData] = useState<RepostRequest>({ text: "", postId: post.id });

    const handleChange = (event: React.ChangeEvent<any>) => {
        const { name, value } = event.target;
        setRepostData({ ...repostData, [name]: value });
    };

    const addRepost = useCreateRepost(toggleForm);
    const handleSubmit = (e: Event) => {
        e.stopPropagation();
        addRepost.mutate(repostData);
    };

    const avatarPlaceholder = toUpperFirstChar(signedUser?.username);

    return {
        signedUser,
        avatarPlaceholder,
        repostData,
        addRepost,
        handleChange,
        handleSubmit,
    };
};

export default useCreateRepostForm;