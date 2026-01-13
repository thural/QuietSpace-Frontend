import { ContentType } from "@/api/schemas/native/common";
import { ReactionType } from "@/api/schemas/native/reaction";
import { useDeletePost } from "@/services/data/usePostData";
import useReaction from "./useReaction";

const usePostActions = (postId: string) => {
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
