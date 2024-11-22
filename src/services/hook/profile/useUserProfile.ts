import { getSignedUserElseThrow } from "@/api/queries/userQueries";
import { ResId } from "@/api/schemas/inferred/common";
import { useGetPostsByUserId } from "@/services/data/usePostData";
import { useGetFollowers, useGetFollowings, useGetUserById } from "@/services/data/useUserData";
import { nullishValidationdError } from "@/utils/errorUtils";
import { useEffect, useState } from "react";
import useNavigation from "../shared/useNavigation";

const useUserProfile = (userId: ResId) => {

    const signedUser = getSignedUserElseThrow();
    if (userId === undefined) throw nullishValidationdError({ userId });
    const [isHasAccess, setIsHasAccss] = useState({ data: false, isLoading: true, isError: false });


    const user = useGetUserById(userId);
    const userPosts = useGetPostsByUserId(userId);
    if (signedUser === undefined || user === undefined) throw nullishValidationdError({ signedUser, user });
    const followers = useGetFollowers(userId); // TODO: fetch conditionally on user profile privacy
    const followings = useGetFollowings(userId); // TODO: fetch conditionally on user profile privacy

    const [viewFollowers, setViewFollowers] = useState(false);
    const toggleFollowers = () => setViewFollowers(!viewFollowers);

    const [viewFollowings, setViewFollowings] = useState(false);
    const toggleFollowings = () => setViewFollowings(!viewFollowings);


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
        const isFollowing = followers.data.content.some(user => user.id === signedUser.id);
        setIsHasAccss({ ...isHasAccess, isLoading: false, data: (!user.data.isPrivateAccount || isFollowing) })
    }

    useEffect(updateState, [user.data, followers.data]);


    return {
        user,
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



export const useCurrentProfile = () => {

    const { navigatePath } = useNavigation();
    const signedUser = getSignedUserElseThrow();
    const userPosts = useGetPostsByUserId(signedUser.id);

    const followers = useGetFollowers(signedUser.id);
    const followings = useGetFollowings(signedUser.id);

    const [viewFollowers, setViewFollowers] = useState(false);
    const toggleFollowers = () => setViewFollowers(!viewFollowers);

    const [viewFollowings, setViewFollowings] = useState(false);
    const toggleFollowings = () => setViewFollowings(!viewFollowings);

    const handleSignout = () => navigatePath("/signout");


    return {
        signedUser,
        userPosts,
        followers,
        followings,
        viewFollowers,
        viewFollowings,
        toggleFollowings,
        toggleFollowers,
        handleSignout
    }
}

export default useUserProfile