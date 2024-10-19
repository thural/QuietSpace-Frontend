import { useDeleteComment } from "@hooks/useCommentData";
import { useToggleReaction } from "@hooks/useReactionData";
import { useQueryClient } from "@tanstack/react-query";

const useRepliedComment = (comment) => {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const deleteComment = useDeleteComment(comment.id);
    const toggleLike = useToggleReaction(comment.id);

    const handleDeleteComment = () => {
        deleteComment.mutate(comment.id);
    };

    const handleReaction = async (event, type) => {
        event.preventDefault();
        const reactionBody = {
            userId: user.id,
            contentId: comment.id,
            reactionType: type,
            contentType: "COMMENT" // Adjust this enum if necessary
        };
        toggleLike.mutate(reactionBody);
    };

    return { user, handleDeleteComment, handleReaction };
};

export default useRepliedComment;