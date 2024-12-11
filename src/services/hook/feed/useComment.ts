import useUserQueries from "@/api/queries/userQueries";
import { CommentResponse } from "@/api/schemas/inferred/comment";
import { ContentType } from "@/api/schemas/native/common";
import { ReactionType } from "@/api/schemas/native/reaction";
import { useDeleteComment } from "@/services/data/useCommentData";
import useReaction from "@/services/hook/feed/useReaction";
import { useState } from "react";

const useComment = (comment: CommentResponse) => {

    const { getSignedUserElseThrow } = useUserQueries();
    const user = getSignedUserElseThrow();
    const deleteComment = useDeleteComment();

    const handleReaction = useReaction(comment.id);
    const handleLikeToggle = (event: Event) => {
        event.preventDefault();
        handleReaction(ContentType.COMMENT, ReactionType.LIKE);
    };

    const handleDeleteComment = () => {
        deleteComment.mutate(comment.id);
    };

    const [commentFormView, setCommentFormView] = useState(false);
    const toggleCommentForm = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCommentFormView(!commentFormView);
    };

    const isLiked = comment.userReaction?.reactionType === ReactionType.LIKE;
    const isOwner = comment.userId === user.id;

    const appliedStyle = isOwner ? {
        borderRadius: '1rem 0rem 1rem 1rem',
        marginLeft: 'auto'
    } : {};



    return {
        user,
        isOwner,
        appliedStyle,
        commentFormView,
        toggleCommentForm,
        handleDeleteComment,
        handleLikeToggle,
        isLiked,
    };
};

export default useComment