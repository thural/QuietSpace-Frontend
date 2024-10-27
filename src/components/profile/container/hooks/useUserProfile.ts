import { User } from "@/api/schemas/inferred/user";
import { ResId } from "@/api/schemas/inferred/common";
import { useGetPosts, useGetPostsByUserId } from "@/services/data/usePostData";
import { useGetFollowers, useGetFollowings, useGetUserById } from "@/services/data/useUserData";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { nullishValidationdError } from "@/utils/errorUtils";
import { getSignedUser } from "@/api/queries/userQueries";

const useUserProfile = (userId: ResId) => {

    const signedUser: User | undefined = getSignedUser();
    if (signedUser === undefined || userId === undefined) throw new Error("(!) user is undefined");
    const [isHasAccess, setIsHasAccss] = useState({ data: false, isLoading: true, isError: false });

    // TODO: refactor Overlay component tu utilize local view state instead
    const initViewState = { followers: false, followings: false }
    const [viewState, setviewState] = useState(initViewState);

    const user = useGetUserById(userId);
    const userPosts = useGetPostsByUserId(userId);
    if (signedUser === undefined || user === undefined) throw nullishValidationdError({ signedUser, user });
    const followers = useGetFollowers(userId); // TODO: fetch conditionally on user profile privacy
    const followings = useGetFollowings(userId); // TODO: fetch conditionally on user profile privacy


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

    const toggleFollowings = () => setviewState({ ...viewState, followings: !viewState.followings });
    const toggleFollowers = () => setviewState({ ...viewState, followers: !viewState.followers });


    return {
        user,
        followers,
        followings,
        isHasAccess,
        userPosts,
        viewState,
        toggleFollowers,
        toggleFollowings,
    }
}



export const useCurrentProfile = () => {

    const navigate = useNavigate();
    const userPosts = useGetPosts();
    const signedUser: User | undefined = getSignedUser();

    // TODO: refactor Overlay component tu utilize local view state instead
    const initViewState = { followers: false, followings: false }
    const [viewState, setviewState] = useState(initViewState);

    if (signedUser === undefined) throw nullishValidationdError({ signedUser });

    const followers = useGetFollowers(signedUser.id);
    const followings = useGetFollowings(signedUser.id);

    if (followers.isLoading || followings.isLoading) throw new Error("some error");


    const toggleFollowings = () => {
        setviewState({ ...viewState, followings: !viewState.followings });
    }

    const toggleFollowers = () => {
        setviewState({ ...viewState, followers: !viewState.followers });
    }

    const handleSignout = () => {
        navigate("/signout");
    }


    return {
        signedUser,
        userPosts,
        followers,
        followings,
        viewState,
        toggleFollowings,
        toggleFollowers,
        handleSignout
    }
}

export default useUserProfile