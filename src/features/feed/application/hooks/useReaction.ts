import useUserQueries from "@features/profile/data/userQueries";
import { ReactionType } from "../../../feed/data/models/reaction";
import { ContentType, ResId } from "../../../../shared/api/models/common";
import { useToggleReaction } from "@features/feed/data/useReactionData";

/**
 * Custom hook for managing reactions (likes/dislikes) on content.
 *
 * This hook provides functionality to toggle reactions for a specific content item
 * by interacting with the user queries and reaction data services.
 *
 * @param {ResId} contentId - The ID of the content item to react to.
 * @returns {function(ContentType, ReactionType): Promise<void>} - A function to handle the reaction.
 * 
 * @example
 * const handleReaction = useReaction(postId);
 * handleReaction(ContentType.POST, ReactionType.LIKE);
 */
const useReaction = (contentId: ResId) => {
    const { getSignedUserElseThrow } = useUserQueries();
    const user = getSignedUserElseThrow();
    const toggleLike = useToggleReaction(contentId);

    /**
     * Handles the reaction to the specified content item.
     *
     * @param {ContentType} contentType - The type of the content (e.g., POST, COMMENT).
     * @param {ReactionType} reactionType - The type of reaction (e.g., LIKE, DISLIKE).
     * @returns {Promise<void>} - A promise that resolves when the reaction is processed.
     */
    const handleReaction = async (contentType: ContentType, reactionType: ReactionType) => {
        const reactionBody = {
            userId: user.id,
            contentId,
            reactionType,
            contentType,
        };
        toggleLike.mutate(reactionBody);
    };

    return handleReaction;
};

export default useReaction;