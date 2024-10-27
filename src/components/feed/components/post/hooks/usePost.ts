import { useGetComments } from "@/services/data/useCommentData";
import { useDeletePost } from "@/services/data/usePostData";
import { useToggleReaction } from "@/services/data/useReactionData";
import { viewStore } from "@/services/zustand";
import { useQueryClient } from "@tanstack/react-query";
import { ContentType, LikeType } from "@/utils/enumClasses";
import { useState } from "react";
import { PostSchema } from "@/api/schemas/inferred/post";
import { User } from "@/api/schemas/inferred/user";
import { UserReactionResponse } from "@/api/schemas/inferred/reaction";

export const usePost = (post: PostSchema) => {
    const queryClient = useQueryClient();
    const user: User | undefined = queryClient.getQueryData(["user"]);
    const { data: viewData, setViewData } = viewStore();
    const { editPost: editPostView } = viewData;

    const { id: postId, username, userReaction, text, likeCount, dislikeCount } = post;
    const [showComments, setShowComments] = useState(false);

    const { data: comments } = useGetComments(postId);
    const deletePost = useDeletePost(postId);
    const togglePostLike = useToggleReaction(postId);

    const handleDeletePost = async () => {
        deletePost.mutate();
    };

    const handleReaction = async (event: React.MouseEvent, likeType: UserReactionResponse) => {
        event.preventDefault();
        if (user === undefined) {
            console.error("(!) could not handle user reaction: user is undefined");
            return
        }
        const reactionBody = {
            userId: user.id,
            contentId: postId,
            reactionType: likeType,
            contentType: ContentType.POST.toString(),
        };
        togglePostLike.mutate(reactionBody);
    };

    const handleLike = (event: React.MouseEvent<SVGElement, MouseEvent>) => handleReaction(event, LikeType.LIKE.toString());
    const handleDislike = (event: React.MouseEvent<SVGElement, MouseEvent>) => handleReaction(event, LikeType.DISLIKE.toString());
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