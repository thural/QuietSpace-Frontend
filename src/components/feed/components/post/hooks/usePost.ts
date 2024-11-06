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
import { useNavigate } from "react-router-dom";



export const usePost = (postId: ResId) => {

    const signedUser = getSignedUser();
    if (signedUser === undefined) throw nullishValidationdError({ signedUser });

    const navigate = useNavigate();

    const handleNavigation = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/feed/${postId}`);
    }

    const handleUserNavigation = (e: React.MouseEvent, userId: ResId) => {
        e.stopPropagation();
        if (userId === signedUser.id) return navigate(`/profile`);
        navigate(`/profile/${userId}`);
    }


    const { data: post, isLoading, isError } = useGetPostById(postId);

    const comments = useGetComments(postId);
    const deletePost = useDeletePost(postId);
    const togglePostLike = useToggleReaction(postId);


    const handleDeletePost = async (e: React.MouseEvent) => {
        e.stopPropagation();
        deletePost.mutate();
    }

    const handleReaction = async (e: React.MouseEvent, reaction: ReactionType) => {
        e.preventDefault();
        const reactionBody = {
            userId: signedUser.id,
            contentId: postId,
            reactionType: reaction,
            contentType: ContentType.POST,
        };
        togglePostLike.mutate(reactionBody);
    };

    const handleLike = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
        event.stopPropagation();
        handleReaction(event, Reactiontype.LIKE);
    }
    const handleDislike = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
        event.stopPropagation();
        handleReaction(event, Reactiontype.DISLIKE);
    }
    const isMutable = signedUser?.role === "admin" || post?.userId === signedUser?.id;

    const [commentFormView, setCommentFormView] = useState(false);
    const toggleCommentForm = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCommentFormView(!commentFormView);
    }

    const [showComments, setShowComments] = useState(false);
    const toggleComments = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowComments(!showComments);
    }

    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const toggleEditForm = (e: React.MouseEvent) => {
        if (!!e) e.stopPropagation();
        setIsOverlayOpen(!isOverlayOpen);
    };



    return {
        post,
        isLoading,
        signedUser,
        isError,
        postId,
        showComments,
        commentFormView,
        comments,
        isMutable,
        isOverlayOpen,
        handleDeletePost,
        handleLike,
        handleDislike,
        handleNavigation,
        handleUserNavigation,
        toggleEditForm,
        toggleComments,
        toggleCommentForm,
    };
};