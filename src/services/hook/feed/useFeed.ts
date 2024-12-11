import useUserQueries from "@/api/queries/userQueries";
import { useGetPagedPosts } from "@/services/data/usePostData";
import { useState } from "react";

export const useFeed = () => {

    const { getSignedUserElseThrow } = useUserQueries();
    const user = getSignedUserElseThrow();
    const posts = useGetPagedPosts();

    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const toggleOverlay = () => setIsOverlayOpen(!isOverlayOpen);

    return {
        user,
        posts,
        isOverlayOpen,
        toggleOverlay
    };
};

export default useFeed