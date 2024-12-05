import { getSignedUserElseThrow } from "@/api/queries/userQueries";
import { ResId } from "@/api/schemas/inferred/common";
import { ContentType } from "@/api/schemas/native/common";
import { Reactiontype } from "@/api/schemas/native/reaction";
import { useGetComments } from "@/services/data/useCommentData";
import { useDeletePost, useGetPostById } from "@/services/data/usePostData";
import { useState } from "react";
import useReaction from "./useReaction";
import useNavigation from "../shared/useNavigation";
import { nullishValidationdError } from "@/utils/errorUtils";



export const usePost = (postId: ResId) => {

    const signedUser = getSignedUserElseThrow();
    const { data: post, isLoading, isError } = useGetPostById(postId);
    if (isError) throw nullishValidationdError({ post });
    const { navigatePath } = useNavigation();

    const handleNavigation = (e: React.MouseEvent) => {
        e && e.stopPropagation();
        navigatePath(`/feed/${postId}`);
    }

    const deletePost = useDeletePost(postId);
    const handleDeletePost = async (e: React.MouseEvent) => {
        e && e.stopPropagation();
        deletePost.mutate();
    }

    const handleReaction = useReaction(postId);
    const handleLike = (e: React.MouseEvent) => {
        e && e.stopPropagation();
        handleReaction(ContentType.POST, Reactiontype.LIKE);
    }

    const handleDislike = (event: React.MouseEvent) => {
        event.stopPropagation();
        handleReaction(ContentType.POST, Reactiontype.DISLIKE);
    }

    const [commentFormView, setCommentFormView] = useState(false);
    const toggleCommentForm = (e: React.MouseEvent) => {
        e && e.stopPropagation();
        setCommentFormView(!commentFormView);
    }

    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const toggleEditForm = (e: React.MouseEvent) => {
        e && e.stopPropagation();
        setIsOverlayOpen(!isOverlayOpen);
    };

    const [repostFormView, setRepostFormView] = useState(false);
    const toggleRepostForm = (e: Event) => {
        e && e.stopPropagation();
        setRepostFormView(!repostFormView);
    }

    const [shareFormview, setShareFormView] = useState(false);
    const toggleShareForm = (e: Event) => {
        e && e.stopPropagation();
        setShareFormView(!shareFormview);
    }


    const comments = useGetComments(postId);
    const isMutable = signedUser?.role === "ADMIN" || post?.userId === signedUser?.id;
    const hasCommented = comments.data?.content.some(comment => comment.userId === signedUser.id);



    return {
        post,
        isLoading,
        isError,
        comments,
        hasCommented,
        shareFormview,
        handleDeletePost,
        handleLike,
        handleDislike,
        isMutable,
        isOverlayOpen,
        commentFormView,
        repostFormView,
        toggleShareForm,
        toggleRepostForm,
        toggleEditForm,
        toggleCommentForm,
        handleNavigation,
    };
};