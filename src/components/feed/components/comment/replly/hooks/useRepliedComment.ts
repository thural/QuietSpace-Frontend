import { Comment } from "@/api/schemas/inferred/comment";
import { ReactionType, UserReaction } from "@/api/schemas/inferred/reaction";
import { User } from "@/api/schemas/inferred/user";
import { ContentType } from "@/api/schemas/native/common";
import { useDeleteComment } from "@/hooks/data/useCommentData";
import { useToggleReaction } from "@/hooks/data/useReactionData";
import { nullishValidationdError } from "@/utils/errorUtils";
import { useQueryClient } from "@tanstack/react-query";

const useRepliedComment = (comment: Comment) => {

    const queryClient = useQueryClient();
    const user: User | undefined = queryClient.getQueryData(["user"]);
    const deleteComment = useDeleteComment(comment.id);
    const toggleReaction = useToggleReaction();

    if (user === undefined) throw nullishValidationdError({ user });

    const handleDeleteComment = () => deleteComment.mutate(comment.id);

    const handleReaction = async (event: Event, type: ReactionType) => {
        event.preventDefault();

        const reactionBody: UserReaction = {
            userId: user.id,
            contentId: comment.id,
            reactionType: type,
            contentType: ContentType.COMMENT
        };

        toggleReaction.mutate(reactionBody);
    };

    return { user, handleDeleteComment, handleReaction };
};

export default useRepliedComment