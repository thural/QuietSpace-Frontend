import { getSignedUser } from "@/api/queries/userQueries";
import { useGetPosts } from "@/services/data/usePostData";
import { nullishValidationdError } from "@/utils/errorUtils";
import { useState } from "react";

export const useFeed = () => {

    const user = getSignedUser();
    const posts = useGetPosts();

    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const toggleOverlay = () => setIsOverlayOpen(!isOverlayOpen);

    if (user === undefined) throw nullishValidationdError({ user });

    return {
        user,
        posts,
        isOverlayOpen,
        toggleOverlay
    };
};

export default useFeed