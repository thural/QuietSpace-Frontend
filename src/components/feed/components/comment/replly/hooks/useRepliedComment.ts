import { CommentSchema } from "@/api/schemas/comment";
import { Reactiontype } from "@/api/schemas/reaction";
import { UserSchema } from "@/api/schemas/user";
import { useDeleteComment } from "@/hooks/data/useCommentData";
import { useToggleReaction } from "@/hooks/data/useReactionData";
import { produceUndefinedError } from "@/utils/errorUtils";
import { useQueryClient } from "@tanstack/react-query";

const useRepliedComment = (comment: CommentSchema) => {
    const queryClient = useQueryClient();
    const user: UserSchema | undefined = queryClient.getQueryData(["user"]);
    const deleteComment = useDeleteComment(comment.id);
    const toggleReaction = useToggleReaction();

    if (user === undefined) throw produceUndefinedError({ user });

    const handleDeleteComment = () => {
        deleteComment.mutate(comment.id);
    };

    const handleReaction = async (event: Event, type: Reactiontype) => {
        event.preventDefault();

        const reactionBody = {
            userId: user.id,
            contentId: comment.id,
            reactionType: type,
            contentType: "COMMENT" // TODO: adjust this enum if necessary
        };

        toggleReaction.mutate(reactionBody);
    };

    return { user, handleDeleteComment, handleReaction };
};

export default useRepliedComment;