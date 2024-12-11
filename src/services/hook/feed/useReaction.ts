import useUserQueries from "@/api/queries/userQueries";
import { ReactionType } from "@/api/schemas/inferred/reaction";
import { ContentType, ResId } from "@/api/schemas/native/common";
import { useToggleReaction } from "@/services/data/useReactionData";

const useReaction = (contentId: ResId) => {

    const { getSignedUserElseThrow } = useUserQueries();
    const user = getSignedUserElseThrow();
    const toggleLike = useToggleReaction(contentId);


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