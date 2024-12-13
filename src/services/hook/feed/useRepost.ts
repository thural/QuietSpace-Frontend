import useUserQueries from "@/api/queries/userQueries";
import { RepostResponse } from "@/api/schemas/inferred/post";
import { useDeletePost } from "@/services/data/usePostData";
import { useState } from "react";
import useNavigation from "../shared/useNavigation";

/**
 * Custom hook for managing interactions with a repost.
 *
 * This hook provides functionality to delete a repost, toggle the edit form,
 * and navigate to the original post. It also checks if the signed-in user 
 * has permission to modify the repost.
 *
 * @param {RepostResponse} repost - The repost data to manage.
 * @returns {{
 *     handleNavigation: (e: React.MouseEvent) => void, // Function to navigate to the original post.
 *     toggleEditForm: (e: React.MouseEvent) => void,   // Function to toggle the edit form overlay.
 *     handleDeletePost: (e: React.MouseEvent) => Promise<void>, // Function to handle deletion of the repost.
 *     isMutable: boolean                                 // Indicates if the repost can be modified (admin or author).
 * }} - An object containing repost management state and handler functions.
 */
export const useRepost = (repost: RepostResponse) => {
    const { getSignedUserElseThrow } = useUserQueries();
    const signedUser = getSignedUserElseThrow();
    const { navigatePath } = useNavigation();
    const repostId = repost.id;

    const isMutable = signedUser?.role.toUpperCase() === "ADMIN" || repost?.userId === signedUser?.id;

    const deletePost = useDeletePost(repostId);

    /**
     * Handles the deletion of the repost.
     *
     * @param {React.MouseEvent} e - The mouse event triggered by the delete action.
     */
    const handleDeletePost = async (e: React.MouseEvent) => {
        e && e.stopPropagation();
        deletePost.mutate();
    }

    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    /**
     * Toggles the visibility of the edit form overlay.
     *
     * @param {React.MouseEvent} e - The mouse event triggered by the toggle action.
     */
    const toggleEditForm = (e: React.MouseEvent) => {
        e && e.stopPropagation();
        setIsOverlayOpen(!isOverlayOpen);
    };

    /**
     * Navigates to the original post associated with the repost.
     *
     * @param {React.MouseEvent} e - The mouse event triggered by the navigation action.
     */
    const handleNavigation = (e: React.MouseEvent) => {
        e && e.stopPropagation();
        navigatePath(`/feed/${repost.parentId}`);
    }

    return {
        handleNavigation,
        toggleEditForm,
        handleDeletePost,
        isMutable
    }
};