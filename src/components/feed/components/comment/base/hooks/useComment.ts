import { useDeleteComment } from "@/hooks/data/useCommentData";
import { useToggleReaction } from "@/hooks/data/useReactionData";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { User } from "@/api/schemas/inferred/user";
import { Comment } from "@/api/schemas/inferred/comment";
import { nullishValidationdError } from "@/utils/errorUtils";
import { ReactionType } from "@/api/schemas/inferred/reaction";
import { ContentType } from "@/api/schemas/native/common";
import { Reactiontype } from "@/api/schemas/native/reaction";

const useComment = (comment: Comment) => {

    const queryClient = useQueryClient();
    const user: User | undefined = queryClient.getQueryData(["user"]);
    if (user === undefined) throw nullishValidationdError({ user })
    const deleteComment = useDeleteComment(comment.postId);
    const toggleLike = useToggleReaction();

    const [replyFormView, setReplyFormView] = useState(false);


    const handleReaction = async (event: Event, type: ReactionType) => {
        event.preventDefault();

        const reactionBody = {
            userId: user.id,
            contentId: comment.id,
            reactionType: type,
            contentType: ContentType.COMMENT
        };

        toggleLike.mutate(reactionBody);
    };


    const handleDeleteComment = () => {
        deleteComment.mutate(comment.id);
    };

    const handleLikeToggle = (event: Event) => {
        handleReaction(event, Reactiontype.LIKE);
    };

    const handleCommentReply = () => {
        setReplyFormView(!replyFormView);
    };


    const isLiked = comment.userReaction?.reactionType === Reactiontype.LIKE;


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

export default useComment