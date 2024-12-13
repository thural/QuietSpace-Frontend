import useUserQueries from "@/api/queries/userQueries";
import { CommentResponse } from "@/api/schemas/inferred/comment";
import { ContentType } from "@/api/schemas/native/common";
import { ReactionType } from "@/api/schemas/native/reaction";
import { useDeleteComment } from "@/services/data/useCommentData";
import useReaction from "./useReaction";

/**
 * Custom hook for managing interactions with a replied comment.
 *
 * This hook provides functionality to delete a comment and toggle reactions
 * (likes) on a specific comment. It also retrieves the signed-in user.
 *
 * @param {CommentResponse} comment - The comment data to manage.
 * @returns {{
 *     user: object,                                  // The signed-in user object.
 *     handleDeleteComment: () => void,              // Function to handle the deletion of the comment.
 *     handleLikeToggle: (event: Event) => void      // Function to toggle the like reaction on the comment.
 * }} - An object containing the comment management state and handler functions.
 */
const useRepliedComment = (comment: CommentResponse) => {
    const { getSignedUserElseThrow } = useUserQueries();
    const user = getSignedUserElseThrow();

    const deleteComment = useDeleteComment();

    /**
     * Handles the deletion of the comment.
     */
    const handleDeleteComment = () => deleteComment.mutate(comment.id);

    const handleReaction = useReaction(comment.id);

    /**
     * Toggles the like reaction for the comment.
     *
     * @param {Event} event - The event triggered by the like action.
     */
    const handleLikeToggle = (event: Event) => {
        event.preventDefault();
        handleReaction(ContentType.COMMENT, ReactionType.LIKE);
    };

    return { user, handleDeleteComment, handleLikeToggle };
};

export default useRepliedComment;