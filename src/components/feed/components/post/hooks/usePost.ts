import { getSignedUser } from "@/api/queries/userQueries";
import { ResId } from "@/api/schemas/inferred/common";
import { ReactionType } from "@/api/schemas/inferred/reaction";
import { ContentType } from "@/api/schemas/native/common";
import { Reactiontype } from "@/api/schemas/native/reaction";
import { useGetComments } from "@/services/data/useCommentData";
import { useDeletePost, useGetPostById } from "@/services/data/usePostData";
import { useToggleReaction } from "@/services/data/useReactionData";
import { nullishValidationdError } from "@/utils/errorUtils";
import { useState } from "react";
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


    const { data: post, isLoading, isError, isSuccess } = useGetPostById(postId);

    const comments = useGetComments(postId);
    const deletePost = useDeletePost(postId);
    const togglePostLike = useToggleReaction(postId);

    const hasCommented = comments.data?.content.some(comment => comment.userId === signedUser.id);


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

    const toggleRepostForm = (e: Event) => {
        if (!!e) e.stopPropagation();
        setRepostFormView(!repostFormView);
    }
    const [repostFormView, setRepostFormView] = useState(false);




    return {
        post,
        isLoading,
        isSuccess,
        signedUser,
        isError,
        postId,
        showComments,
        commentFormView,
        comments,
        hasCommented,
        isMutable,
        isOverlayOpen,
        repostFormView,
        toggleRepostForm,
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