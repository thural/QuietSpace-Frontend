import useUserQueries from "@/api/queries/userQueries";
import { RepostResponse } from "@/api/schemas/inferred/post";
import { useDeletePost } from "@/services/data/usePostData";
import { useState } from "react";
import useNavigation from "../shared/useNavigation";



export const useRepost = (repost: RepostResponse) => {

    const { getSignedUserElseThrow } = useUserQueries();
    const signedUser = getSignedUserElseThrow();
    const { navigatePath } = useNavigation();
    const repostId = repost.id;

    const isMutable = signedUser?.role.toUpperCase() === "ADMIN" || repost?.userId === signedUser?.id;

    const deletePost = useDeletePost(repostId);
    const handleDeletePost = async (e: React.MouseEvent) => {
        e && e.stopPropagation();
        deletePost.mutate();
    }

    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const toggleEditForm = (e: React.MouseEvent) => {
        e && e.stopPropagation();
        setIsOverlayOpen(!isOverlayOpen);
    };

    const handleNavigation = (e: React.MouseEvent) => {
        e && e.stopPropagation();
        navigatePath(`/feed/${repost.parentId}`);
    }

    return {
        handleNavigation,
        toggleEditForm,
        handleDeletePost,
        isMutable
    }
};