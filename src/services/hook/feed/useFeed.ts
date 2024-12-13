import useUserQueries from "@/api/queries/userQueries";
import { useGetPagedPosts } from "@/services/data/usePostData";
import { useState } from "react";

/**
 * Custom hook for managing the state and logic of a feed.
 *
 * This hook retrieves the signed-in user, fetches paginated posts,
 * and manages the overlay state for the feed UI.
 *
 * @returns {{
 *     user: object,                                   // The signed-in user object.
 *     posts: any,                                    // The paginated posts data.
 *     isOverlayOpen: boolean,                        // Indicates if the overlay is open.
 *     toggleOverlay: () => void                      // Function to toggle the overlay state.
 * }} - An object containing the feed state and handler functions.
 */
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

export default useFeed;