import { getSignedUser } from "@/api/queries/userQueries";
import { Comment } from "@/api/schemas/inferred/comment";
import { ReactionType, UserReaction } from "@/api/schemas/inferred/reaction";
import { ContentType } from "@/api/schemas/native/common";
import { useDeleteComment } from "@/services/data/useCommentData";
import { useToggleReaction } from "@/services/data/useReactionData";
import { nullishValidationdError } from "@/utils/errorUtils";

const useRepliedComment = (comment: Comment) => {

    const user = getSignedUser();
    if (user === undefined) throw nullishValidationdError({ user });


    const deleteComment = useDeleteComment(comment.id);
    const toggleReaction = useToggleReaction();

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