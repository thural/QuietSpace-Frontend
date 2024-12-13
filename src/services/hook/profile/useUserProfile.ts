import useUserQueries from "@/api/queries/userQueries";
import { ResId } from "@/api/schemas/inferred/common";
import { useGetPostsByUserId } from "@/services/data/usePostData";
import { useGetFollowers, useGetFollowings, useGetUserById } from "@/services/data/useUserData";
import { useEffect, useState } from "react";
import useNavigation from "../shared/useNavigation";

/**
 * Custom hook for managing user profile data.
 *
 * This hook retrieves the user profile, posts, and follower/following 
 * information for a specific user. It also controls access based on 
 * the user's privacy settings.
 *
 * @param {ResId} userId - The ID of the user whose profile is being managed.
 * @throws {Error} Throws an error if userId is undefined.
 * @returns {{
 *     user: object,                                   // The user profile data.
 *     postsCount: number,                             // The count of posts by the user.
 *     followingsCount: number,                        // The count of users being followed.
 *     followersCount: number,                         // The count of followers.
 *     followers: object,                              // The followers data.
 *     followings: object,                             // The followings data.
 *     isHasAccess: { data: boolean, isLoading: boolean, isError: boolean }, // Access state.
 *     userPosts: object,                              // User's posts data.
 *     viewFollowers: boolean,                         // State to toggle followers view.
 *     viewFollowings: boolean,                        // State to toggle followings view.
 *     toggleFollowers: () => void,                   // Function to toggle followers view.
 *     toggleFollowings: () => void                    // Function to toggle followings view.
 * }} - An object containing user profile information and handler functions.
 */
const useUserProfile = (userId: ResId) => {
    const { getSignedUserElseThrow } = useUserQueries();
    const signedUser = getSignedUserElseThrow();
    if (userId === undefined) throw new Error("userId is undefined");

    const [isHasAccess, setIsHasAccss] = useState({ data: false, isLoading: true, isError: false });

    const user = useGetUserById(userId);
    const userPosts = useGetPostsByUserId(userId);
    if (signedUser === undefined || user === undefined) throw new Error("signedUser is undefined");

    const followers = useGetFollowers(userId); // TODO: fetch conditionally on user profile privacy
    const followings = useGetFollowings(userId); // TODO: fetch conditionally on user profile privacy

    const [viewFollowers, setViewFollowers] = useState(false);
    const toggleFollowers = () => setViewFollowers(!viewFollowers);

    const [viewFollowings, setViewFollowings] = useState(false);
    const toggleFollowings = () => setViewFollowings(!viewFollowings);

    /**
     * Updates the access state based on user and followers data.
     */
    const updateState = () => {
        if (user.isLoading || followers.isLoading) return;
        if (user.isError || followers.isError) {
            setIsHasAccss({ ...isHasAccess, isError: true });
            return;
        }
        if (user.data === undefined || followers.data === undefined) {
            setIsHasAccss({ ...isHasAccess, isError: true });
            return;
        }
        const followersContent = followers.data?.pages.flatMap((page) => page.content);
        const isFollowing = followersContent.some(user => user.id === signedUser.id);
        setIsHasAccss({ ...isHasAccess, isLoading: false, data: (!user.data.isPrivateAccount || isFollowing) });
    }

    const postsCount = userPosts.data?.pages[0].totalElements;
    const followingsCount = followings.data?.pages[0].totalElements;
    const followersCount = followers.data?.pages[0].totalElements;

    useEffect(updateState, [user.data, followers.data]);

    return {
        user,
        postsCount,
        followingsCount,
        followersCount,
        followers,
        followings,
        isHasAccess,
        userPosts,
        viewFollowers,
        viewFollowings,
        toggleFollowers,
        toggleFollowings,
    }
}

/**
 * Custom hook for managing the current user's profile.
 *
 * This hook retrieves the signed-in user's posts, followers, and followings.
 * It provides functions to toggle the visibility of followers and followings,
 * as well as handling sign-out.
 *
 * @returns {{
 *     signedUser: object,                             // The signed-in user's profile data.
 *     userPosts: object,                             // The posts made by the signed-in user.
 *     followers: object,                             // The followers data for the signed-in user.
 *     followings: object,                            // The followings data for the signed-in user.
 *     postsCount: number,                           // The count of the signed-in user's posts.
 *     followingsCount: number,                       // The count of users being followed by the signed-in user.
 *     followersCount: number,                        // The count of followers of the signed-in user.
 *     viewFollowers: boolean,                        // State to toggle followers view.
 *     viewFollowings: boolean,                       // State to toggle followings view.
 *     toggleFollowings: () => void,                 // Function to toggle followings view.
 *     toggleFollowers: () => void,                  // Function to toggle followers view.
 *     handleSignout: () => void                     // Function to handle user sign-out.
 * }} - An object containing current user profile information and handler functions.
 */
export const useCurrentProfile = () => {
    const { navigatePath } = useNavigation();
    const { getSignedUserElseThrow } = useUserQueries();
    const signedUser = getSignedUserElseThrow();
    const userPosts = useGetPostsByUserId(signedUser.id);

    const followers = useGetFollowers(signedUser.id);
    const followings = useGetFollowings(signedUser.id);

    const [viewFollowers, setViewFollowers] = useState(false);
    const toggleFollowers = () => setViewFollowers(!viewFollowers);

    const [viewFollowings, setViewFollowings] = useState(false);
    const toggleFollowings = () => setViewFollowings(!viewFollowings);

    const handleSignout = () => navigatePath("/signout");

    const postsCount = userPosts.data?.pages[0].totalElements;
    const followingsCount = followings.data?.pages[0].totalElements;
    const followersCount = followers.data?.pages[0].totalElements;

    return {
        signedUser,
        userPosts,
        followers,
        followings,
        postsCount,
        followingsCount,
        followersCount,
        viewFollowers,
        viewFollowings,
        toggleFollowings,
        toggleFollowers,
        handleSignout
    }
}

export default useUserProfile;