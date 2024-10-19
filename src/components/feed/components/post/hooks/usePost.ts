import { useGetComments } from "@hooks/useCommentData";
import { useDeletePost } from "@hooks/usePostData";
import { useToggleReaction } from "@hooks/useReactionData";
import { viewStore } from "@hooks/zustand";
import { useQueryClient } from "@tanstack/react-query";
import { ContentType, LikeType } from "@utils/enumClasses";
import { useState } from "react";

export const usePost = (post) => {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const { data: viewData, setViewData } = viewStore();
    const { editPost: editPostView } = viewData;

    const { id: postId, username, userReaction, text, likeCount, dislikeCount } = post;
    const [showComments, setShowComments] = useState(false);

    const { data: comments, status, error } = useGetComments(postId);
    const deletePost = useDeletePost(postId);
    const togglePostLike = useToggleReaction(postId);

    const handleDeletePost = async (event) => {
        event.preventDefault();
        deletePost.mutate();
    };

    const handleReaction = async (event, likeType) => {
        event.preventDefault();
        const reactionBody = {
            userId: user.id,
            contentId: postId,
            reactionType: likeType,
            contentType: ContentType.POST.toString(),
        };
        togglePostLike.mutate(reactionBody);
    };

    const handleLike = (event) => handleReaction(event, LikeType.LIKE.toString());
    const handleDislike = (event) => handleReaction(event, LikeType.DISLIKE.toString());
    const isMutable = user?.role === "admin" || post?.userId === user?.id;

    const toggleComments = () => setShowComments(!showComments);

    return {
        user,
        viewData,
        setViewData,
        editPostView,
        postId,
        username,
        userReaction,
        text,
        likeCount,
        dislikeCount,
        showComments,
        comments,
        handleDeletePost,
        handleLike,
        handleDislike,
        isMutable,
        toggleComments,
    };
};