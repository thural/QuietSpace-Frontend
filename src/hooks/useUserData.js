import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "./zustand";
import { USER_PATH, USER_PROFILE_URL } from "../constants/ApiPath";
import { fetchFollowers, fetchFollowings, fetchToggleFollow, fetchUser, fetchUserById, fetchUsersByQuery } from "../api/userRequests";


export const useGetCurrentUser = () => {

    const { data: authData } = useAuthStore();

    return useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const response = await fetchUser(USER_PROFILE_URL, authData.accessToken);
            return await response.json();
        },
        onSuccess: (data) => console.log("user: ", data),
        enabled: !!authData?.accessToken,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        select: (data) => data.content
    })
}

export const useQueryUsers = (setQueryResult) => {

    const queryClient = useQueryClient();
    const signedUser = queryClient.getQueryData(["user"]);
    const { data: authData } = useAuthStore();

    const onSuccess = (data, variables, context) => {
        setQueryResult(data["content"].filter(user => user.id !== signedUser.id));
        console.log("user query success:", data);
    }

    const onError = (error, variables, context) => {
        console.log("error on querying users: ", error.message);
    }

    return useMutation({
        mutationFn: async (inputText) => {
            const response = await fetchUsersByQuery(inputText, authData.accessToken);
            return response.json();
        },
        onSuccess,
        onError,
    });
}

export const useGetUserById = (userId) => {

    const { data: authData } = useAuthStore();

    return useQuery({
        queryKey: ["users", { id: userId }],
        queryFn: async () => {
            const response = await fetchUserById(userId, authData.accessToken);
            return await response.json();
        },
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
}

export const useGetFollowers = () => {

    const { data: authData } = useAuthStore();

    return useQuery({
        queryKey: ["followers"],
        queryFn: async () => {
            const response = await fetchFollowers(authData.accessToken);
            return await response.json();
        },
        enabled: !!authData?.accessToken,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        select: (data) => data.content
    })
}

export const useGetFollowings = () => {

    const { data: authData } = useAuthStore();

    return useQuery({
        queryKey: ["followings"],
        queryFn: async () => {
            const response = await fetchFollowings(authData.accessToken);
            return await response.json();
        },
        enabled: !!authData?.accessToken,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        select: (data) => data.content
    })
}

export const useToggleFollow = () => {

    const queryClient = useQueryClient();
    const { data: authData } = useAuthStore();

    const onSuccess = (data, variables, context) => {
        queryClient.invalidateQueries(["followings"], ["followers"])
        console.log("toggle follow success:", data);
    }

    const onError = (error, variables, context) => {
        console.log("error on toggling follow: ", error.message);
    }

    return useMutation({
        mutationFn: async (userId) => {
            return await fetchToggleFollow(userId, authData.accessToken);
        },
        onSuccess,
        onError,
    });
}