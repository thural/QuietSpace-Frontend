import useUserQueries from "@features/profile/data/userQueries";
import { CommentResponse } from "@/features/feed/data/models/comment";
import { ContentType } from "@/shared/api/models/commonNative";
import { ReactionType } from "@/features/feed/data/models/reactionNative";
import { useCommentServices } from "./useCommentService";
import { useAuthStore } from "@/core/store/zustand";
import { useState } from "react";

/**
 * Custom hook for managing comment-related actions and state.
 *
 * This hook provides functionality to handle reactions, delete comments, 
 * and manage the visibility of the comment reply form for a given comment.
 *
 * @param {CommentResponse} comment - The comment object to manage.
 * @returns {{
 *     user: object,                     // The signed-in user object.
 *     isOwner: boolean,                 // Indicates if the current user is the comment owner.
 *     appliedStyle: object,             // Styles to apply if the user is the owner.
 *     commentFormView: boolean,         // State indicating if the comment form is visible.
 *     toggleCommentForm: (e: React.MouseEvent) => void, // Function to toggle the comment form visibility.
 *     handleDeleteComment: () => void,  // Function to delete the comment.
 *     handleLikeToggle: (event: Event) => void,       // Function to toggle the like reaction.
 *     isLiked: boolean                   // Indicates if the comment is liked by the user.
 * }} - An object containing comment management functionalities.
 */
const useComment = (comment: CommentResponse) => {
    const { getSignedUserElseThrow } = useUserQueries();
    const user = getSignedUserElseThrow();
    const { data: authData } = useAuthStore();
    const { feedFeatureService } = useCommentServices();

    const handleLikeToggle = async (event: Event) => {
        event.preventDefault();
        
        try {
            await feedFeatureService.interactWithPost(
                comment.id, 
                user.id, 
                'like', 
                authData.accessToken
            );
        } catch (error) {
            console.error('Error liking comment:', error);
            // Error handling is done in the feature service
        }
    };

    const handleDeleteComment = async () => {
        try {
            await feedFeatureService.deleteCommentWithFullInvalidation(
                comment.id, 
                comment.postId, 
                user.id
            );
        } catch (error) {
            console.error('Error deleting comment:', error);
            // Error handling is done in the feature service
        }
    };

    const [commentFormView, setCommentFormView] = useState(false);

    const toggleCommentForm = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCommentFormView(!commentFormView);
    };

    const isLiked = comment.userReaction?.reactionType === ReactionType.LIKE;
    const isOwner = comment.userId === user.id;

    const appliedStyle = isOwner ? {
        borderRadius: '1rem 0rem 1rem 1rem',
        marginLeft: 'auto'
    } : {};

    return {
        user,
        isOwner,
        appliedStyle,
        commentFormView,
        toggleCommentForm,
        handleDeleteComment,
        handleLikeToggle,
        isLiked,
    };
};

export default useComment;