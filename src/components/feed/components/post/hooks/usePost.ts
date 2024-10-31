import { useGetComments } from "@/services/data/useCommentData";
import { useDeletePost } from "@/services/data/usePostData";
import { useToggleReaction } from "@/services/data/useReactionData";
import { ContentType, LikeType } from "@/utils/enumClasses";
import { useState } from "react";
import { Post } from "@/api/schemas/inferred/post";
import { UserReactionResponse } from "@/api/schemas/inferred/reaction";
import { getSignedUser } from "@/api/queries/userQueries";
import { nullishValidationdError } from "@/utils/errorUtils";

export const usePost = (post: Post) => {

    const user = getSignedUser();
    if (user === undefined) throw nullishValidationdError({ user });

    const { id: postId, username, userReaction, text, likeCount, dislikeCount } = post;

    const comments = useGetComments(postId);
    const deletePost = useDeletePost(postId);
    const togglePostLike = useToggleReaction();


    const handleDeletePost = async () => deletePost.mutate();

    const handleReaction = async (event: React.MouseEvent, reaction: UserReactionResponse) => {
        event.preventDefault();
        const reactionBody = {
            userId: user.id,
            contentId: postId,
            reactionType: reaction.reactionType,
            contentType: ContentType.POST.toString(),
        };
        togglePostLike.mutate(reactionBody);
    };

    const handleLike = (event: React.MouseEvent<SVGElement, MouseEvent>) => handleReaction(event, LikeType.LIKE.toString());
    const handleDislike = (event: React.MouseEvent<SVGElement, MouseEvent>) => handleReaction(event, LikeType.DISLIKE.toString());
    const isMutable = user?.role === "admin" || post?.userId === user?.id;


    const [showComments, setShowComments] = useState(false);
    const toggleComments = () => setShowComments(!showComments);

    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const toggleOverlay = () => setIsOverlayOpen(!isOverlayOpen);



    return {
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
        isOverlayOpen,
        toggleOverlay,
        toggleComments,
    };
};