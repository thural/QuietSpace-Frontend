import { getSignedUserElseThrow } from "@/api/queries/userQueries";
import { PostResponse } from "@/api/schemas/inferred/post";
import { ContentType } from "@/api/schemas/native/common";
import { ReactionType } from "@/api/schemas/native/reaction";
import { useGetComments } from "@/services/data/useCommentData";
import { useDeletePost } from "@/services/data/usePostData";
import { useState } from "react";
import useNavigation from "../shared/useNavigation";
import useReaction from "./useReaction";



export const usePost = (post: PostResponse) => {

    const signedUser = getSignedUserElseThrow();
    const { navigatePath } = useNavigation();
    const postId = post.id;

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
        handleReaction(ContentType.POST, ReactionType.LIKE);
    }

    const handleDislike = (event: React.MouseEvent) => {
        event.stopPropagation();
        handleReaction(ContentType.POST, ReactionType.DISLIKE);
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
    const commentCount = comments.data ? comments.data?.totalElements : 0;
    const isMutable = signedUser?.role.toUpperCase() === "ADMIN" || post?.userId === signedUser?.id;
    const hasCommented = comments.data ? comments.data.content.some(comment => comment.userId === signedUser.id) : false;



    return {
        comments,
        commentCount,
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