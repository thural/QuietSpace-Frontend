import { ContentType } from "@/shared/api/models/commonNative";
import { ReactionType } from "@/features/feed/data/models/reactionNative";
import { useDeletePost } from "@features/feed/data";
import useReaction from "./useReaction";
import { ResId } from "@/shared/api/models/common";

const usePostActions = (postId: ResId) => {
    const deletePost = useDeletePost(postId);

    const handleDeletePost = async (e: React.MouseEvent) => {
        e && e.stopPropagation();
        deletePost.mutate();
    };

    const handleReaction = useReaction(postId);

    const handleLike = (e: React.MouseEvent) => {
        e && e.stopPropagation();
        handleReaction(ContentType.POST, ReactionType.LIKE);
    };

    const handleDislike = (e: React.MouseEvent) => {
        e && e.stopPropagation();
        handleReaction(ContentType.POST, ReactionType.DISLIKE);
    };

    return { handleDeletePost, handleLike, handleDislike };
};

export default usePostActions;
