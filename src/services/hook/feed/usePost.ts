import useUserQueries from "@/api/queries/userQueries";
import { PostResponse } from "@/api/schemas/inferred/post";
import { ContentType } from "@/api/schemas/native/common";
import { ReactionType } from "@/api/schemas/native/reaction";
import { useGetComments } from "@/services/data/useCommentData";
import { useDeletePost } from "@/services/data/usePostData";
import { useState } from "react";
import useNavigation from "../shared/useNavigation";
import useReaction from "./useReaction";

/**
 * Custom hook for managing the state and logic of a post.
 *
 * This hook provides functionalities for navigation, deleting the post,
 * handling reactions (likes and dislikes), managing comment forms,
 * and retrieving comments associated with the post.
 *
 * @param {PostResponse} post - The post data to manage.
 * @returns {{
 *     comments: object,                               // The comments associated with the post.
 *     commentCount: number,                          // The total number of comments on the post.
 *     hasCommented: boolean,                         // Indicates if the signed-in user has commented on the post.
 *     shareFormview: boolean,                        // Indicates if the share form is open.
 *     handleDeletePost: (e: React.MouseEvent) => Promise<void>, // Function to handle post deletion.
 *     handleLike: (e: React.MouseEvent) => void,    // Function to handle liking the post.
 *     handleDislike: (e: React.MouseEvent) => void, // Function to handle disliking the post.
 *     isMutable: boolean,                            // Indicates if the user can modify the post (admin or author).
 *     isOverlayOpen: boolean,                        // Indicates if the edit form overlay is open.
 *     commentFormView: boolean,                      // Indicates if the comment form is visible.
 *     repostFormView: boolean,                       // Indicates if the repost form is visible.
 *     toggleShareForm: (e: Event) => void,          // Function to toggle the share form visibility.
 *     toggleRepostForm: (e: Event) => void,         // Function to toggle the repost form visibility.
 *     toggleEditForm: (e: React.MouseEvent) => void, // Function to toggle the edit form overlay.
 *     toggleCommentForm: (e: React.MouseEvent) => void, // Function to toggle the comment form visibility.
 *     handleNavigation: (e: React.MouseEvent) => void // Function to navigate to the post's detailed view.
 * }} - An object containing the post management state and handler functions.
 */
export const usePost = (post: PostResponse) => {
    const { getSignedUserElseThrow } = useUserQueries();
    const signedUser = getSignedUserElseThrow();
    const { navigatePath } = useNavigation();
    const postId = post.id;

    /**
     * Handles navigation to the post's detailed view.
     *
     * @param {React.MouseEvent} e - The mouse event triggered by the navigation action.
     */
    const handleNavigation = (e: React.MouseEvent) => {
        e && e.stopPropagation();
        navigatePath(`/feed/${postId}`);
    }

    const deletePost = useDeletePost(postId);
    /**
     * Handles the deletion of the post.
     *
     * @param {React.MouseEvent} e - The mouse event triggered by the delete action.
     */
    const handleDeletePost = async (e: React.MouseEvent) => {
        e && e.stopPropagation();
        deletePost.mutate();
    }

    const handleReaction = useReaction(postId);
    /**
     * Handles liking the post.
     *
     * @param {React.MouseEvent} e - The mouse event triggered by the like action.
     */
    const handleLike = (e: React.MouseEvent) => {
        e && e.stopPropagation();
        handleReaction(ContentType.POST, ReactionType.LIKE);
    }

    /**
     * Handles disliking the post.
     *
     * @param {React.MouseEvent} event - The mouse event triggered by the dislike action.
     */
    const handleDislike = (event: React.MouseEvent) => {
        event.stopPropagation();
        handleReaction(ContentType.POST, ReactionType.DISLIKE);
    }

    const [commentFormView, setCommentFormView] = useState(false);
    /**
     * Toggles the visibility of the comment form.
     *
     * @param {React.MouseEvent} e - The mouse event triggered by the toggle action.
     */
    const toggleCommentForm = (e: React.MouseEvent) => {
        e && e.stopPropagation();
        setCommentFormView(!commentFormView);
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

    const [repostFormView, setRepostFormView] = useState(false);
    /**
     * Toggles the visibility of the repost form.
     *
     * @param {Event} e - The event triggered by the toggle action.
     */
    const toggleRepostForm = (e: Event) => {
        e && e.stopPropagation();
        setRepostFormView(!repostFormView);
    }

    const [shareFormview, setShareFormView] = useState(false);
    /**
     * Toggles the visibility of the share form.
     *
     * @param {Event} e - The event triggered by the toggle action.
     */
    const toggleShareForm = (e: Event) => {
        e && e.stopPropagation();
        setShareFormView(!shareFormview);
    }

    const comments = useGetComments(postId);
    const commentCount = comments.data ? comments.data.totalElements : 0;
    const isMutable = signedUser?.role.toUpperCase() === "ADMIN" || post?.userId === signedUser?.id;
    const hasCommented = comments.data ? comments.data.content.some(comment => comment.userId === signedUser.id) : false;

    return {
        comments,
        commentCount,
        hasCommented,
        shareFormview,
        handleDeletePost,
        handleLike,
        handleDislike,
        isMutable,
        isOverlayOpen,
        commentFormView,
        repostFormView,
        toggleShareForm,
        toggleRepostForm,
        toggleEditForm,
        toggleCommentForm,
        handleNavigation,
    };
};

export default usePost;