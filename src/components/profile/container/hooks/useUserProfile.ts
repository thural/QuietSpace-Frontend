import { User } from "@/api/schemas/inferred/user";
import { ResId } from "@/api/schemas/inferred/common";
import { useGetPosts, useGetPostsByUserId } from "@/services/data/usePostData";
import { useGetFollowers, useGetFollowings, useGetUserById } from "@/services/data/useUserData";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { nullishValidationdError } from "@/utils/errorUtils";
import userQueries from "@/api/queries/userQueries";

const useUserProfile = (userId: ResId) => {

    const { getSignedUser } = userQueries();
    const signedUser: User | undefined = getSignedUser();
    if (signedUser === undefined || userId === undefined) throw nullishValidationdError({ signedUser, userId });
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

    const navigate = useNavigate();
    const userPosts = useGetPosts();
    const { getSignedUser } = userQueries();
    const signedUser: User | undefined = getSignedUser();

    if (signedUser === undefined) throw nullishValidationdError({ signedUser });

    const followers = useGetFollowers(signedUser.id);
    const followings = useGetFollowings(signedUser.id);

    const [viewFollowers, setViewFollowers] = useState(false);
    const toggleFollowers = () => setViewFollowers(!viewFollowers);

    const [viewFollowings, setViewFollowings] = useState(false);
    const toggleFollowings = () => setViewFollowings(!viewFollowings);

    const handleSignout = () => navigate("/signout");


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