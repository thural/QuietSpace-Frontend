import { useGetComments } from "@/services/data/useCommentData";
import { useDeletePost, useGetPostById } from "@/services/data/usePostData";
import { useToggleReaction } from "@/services/data/useReactionData";
import { useState } from "react";
import { ReactionType } from "@/api/schemas/inferred/reaction";
import { getSignedUser } from "@/api/queries/userQueries";
import { nullishValidationdError } from "@/utils/errorUtils";
import { Reactiontype } from "@/api/schemas/native/reaction";
import { ContentType } from "@/api/schemas/native/common";
import { ResId } from "@/api/schemas/inferred/common";

export const usePost = (postId: ResId) => {

    const user = getSignedUser();
    if (user === undefined) throw nullishValidationdError({ user });

    const { data: post, isLoading, isError } = useGetPostById(postId);

    const comments = useGetComments(postId);
    const deletePost = useDeletePost(postId);
    const togglePostLike = useToggleReaction(postId);


    const handleDeletePost = async () => deletePost.mutate();

    const handleReaction = async (event: React.MouseEvent, reaction: ReactionType) => {
        event.preventDefault();
        const reactionBody = {
            userId: user.id,
            contentId: postId,
            reactionType: reaction,
            contentType: ContentType.POST,
        };
        togglePostLike.mutate(reactionBody);
    };

    const handleLike = (event: React.MouseEvent<SVGElement, MouseEvent>) => handleReaction(event, Reactiontype.LIKE);
    const handleDislike = (event: React.MouseEvent<SVGElement, MouseEvent>) => handleReaction(event, Reactiontype.DISLIKE);
    const isMutable = user?.role === "admin" || post?.userId === user?.id;


    const [showComments, setShowComments] = useState(false);
    const toggleComments = () => setShowComments(!showComments);

    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const toggleOverlay = () => setIsOverlayOpen(!isOverlayOpen);



    return {
        post,
        isLoading,
        isError,
        postId,
        showComments,
        comments,
        handleDeletePost,
        handleLike,
        handleDislike,
        isMutable,
        isOverlayOpen,
        toggleOverlay,
        toggleComments,
    };
};