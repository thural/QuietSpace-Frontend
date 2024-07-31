import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useAuthStore} from "./zustand";
import {USER_PATH, USER_PROFILE_URL} from "../constants/ApiPath";
import {fetchFollowers, fetchToggleFollow, fetchUser, fetchUserById, fetchUsersByQuery} from "../api/userRequests";


export const useGetCurrentUser = () => {

    const { data: authData } = useAuthStore();

    return useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const response = await fetchUser(USER_PROFILE_URL, authData.token);
            return await response.json();
        },
        enabled: !!authData?.token,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        select: (data) => data.content
    })
}

export const useQueryUsers = (setQueryResult) => {

    const { data: authData } = useAuthStore();

    const onSuccess = (data, variables, context) => {
        setQueryResult(data["content"]);
        console.log("user query success:", data);
    }

    const onError = (error, variables, context) => {
        console.log("error on querying users: ", error.message);
    }

    return useMutation({
        mutationFn: async (inputText) => {
            const response = await fetchUsersByQuery(USER_PATH, inputText, authData.token);
            return response.json();
        },
        onSuccess,
        onError,
    });
}

export const useGetUserById = (userId) => {

    const { data: authData } = useAuthStore();

    return useQuery({
        queryKey: ["users", {id: userId}],
        queryFn: async () => {
            const response = await fetchUserById(userId, authData.token);
            return await response.json();
        },
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
}

export const useGetFollows = () => {

    const { data: authData } = useAuthStore();

    return useQuery({
        queryKey: ["follows"],
        queryFn: async () => {
            const response = await fetchFollowers(authData.token);
            return await response.json();
        },
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
        queryClient.invalidateQueries(["followers"])
        console.log("toggle follow success:", data);
    }

    const onError = (error, variables, context) => {
        console.log("error on toggling follow: ", error.message);
    }

    return useMutation({
        mutationFn: async (userId) => {
            return await fetchToggleFollow(userId, authData.token);
        },
        onSuccess,
        onError,
    });
}