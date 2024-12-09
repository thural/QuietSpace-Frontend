import { getSignedUserElseThrow } from "@/api/queries/userQueries";
import { CommentResponse } from "@/api/schemas/inferred/comment";
import { ContentType } from "@/api/schemas/native/common";
import { ReactionType } from "@/api/schemas/native/reaction";
import { useDeleteComment } from "@/services/data/useCommentData";
import useReaction from "./useReaction";

const useRepliedComment = (comment: CommentResponse) => {

    const user = getSignedUserElseThrow();

    const deleteComment = useDeleteComment(comment.id);
    const handleDeleteComment = () => deleteComment.mutate(comment.id);

    const handleReaction = useReaction(comment.id);
    const handleLikeToggle = (event: Event) => {
        event.preventDefault();
        handleReaction(ContentType.COMMENT, ReactionType.LIKE);
    };


    return { user, handleDeleteComment, handleLikeToggle };
};

export default useRepliedComment