import { UserSchema } from "@/api/schemas/user";
import { useGetPosts, useGetPostsByUserId } from "@/hooks/data/usePostData";
import { useGetFollowers, useGetFollowings, useGetUserById } from "@/hooks/data/useUserData";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useUserProfile = (userId: string | undefined) => {

    const queryClient = useQueryClient();
    const signedUser: UserSchema | undefined = queryClient.getQueryData(["user"]);
    if (signedUser === undefined || userId === undefined) throw new Error("(!) user is undefined");
    const [isHasAccess, setIsHasAccss] = useState({ data: false, isLoading: true, isError: false });

    // TODO: refactor Overlay component tu utilize local view state instead
    const initViewState = { followers: false, followings: false }
    const [viewState, setviewState] = useState(initViewState);

    const user = useGetUserById(userId);
    const userPosts = useGetPostsByUserId(userId);
    if (signedUser === undefined || user === undefined) throw new Error("(!)signed user is undefined");
    const followers = useGetFollowers(userId); // TODO: fetch conditionally on user profile privacy
    const followings = useGetFollowings(userId); // TODO: fetch conditionally on user profile privacy


    useEffect(() => {
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
    },
        [user.data, followers.data]
    );


    const toggleFollowings = () => {
        setviewState({ ...viewState, followings: !viewState.followings });
    }

    const toggleFollowers = () => {
        setviewState({ ...viewState, followers: !viewState.followers });
    }

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
    const queryClient = useQueryClient();
    const { data: userPosts, isLoading: isPostsLoading } = useGetPosts();
    const signedUser: UserSchema | undefined = queryClient.getQueryData(["user"]);

    // TODO: refactor Overlay component tu utilize local view state instead
    const initViewState = { followers: false, followings: false }
    const [viewState, setviewState] = useState(initViewState);

    if (signedUser === undefined || isPostsLoading) throw new Error("some error");

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