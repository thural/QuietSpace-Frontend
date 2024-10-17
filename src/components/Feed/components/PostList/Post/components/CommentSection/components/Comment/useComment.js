import { useDeleteComment } from "@hooks/useCommentData";
import { useToggleReaction } from "@hooks/useReactionData";
import { useQueryClient } from "@tanstack/react-query";
import { ContentType, LikeType } from "@utils/enumClasses";
import { useState } from "react";

const useComment = (comment) => {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const deleteComment = useDeleteComment(comment.postId);
    const toggleLike = useToggleReaction(comment.id);

    const [replyFormView, setReplyFormView] = useState(false);

    const handleReaction = async (event, type) => {
        event.preventDefault();
        const reactionBody = {
            userId: user.id,
            contentId: comment.id,
            reactionType: type,
            contentType: ContentType.COMMENT.toString()
        };
        toggleLike.mutate(reactionBody);
    };

    const handleDeleteComment = () => {
        deleteComment.mutate(comment.id);
    };

    const handleLikeToggle = (event) => {
        handleReaction(event, LikeType.LIKE.toString());
    };

    const handleCommentReply = () => {
        setReplyFormView(!replyFormView);
    };

    const isLiked = comment.userReaction?.reactionType === LikeType.LIKE.name;

    return {
        user,
        replyFormView,
        setReplyFormView,
        handleReaction,
        handleDeleteComment,
        handleLikeToggle,
        handleCommentReply,
        isLiked,
    };
};

export default useComment;