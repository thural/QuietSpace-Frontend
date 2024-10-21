import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { fetchFollowers, fetchFollowings, fetchToggleFollow, fetchUser, fetchUserById, fetchUsersByQuery } from "../api/userRequests";
import { USER_PROFILE_URL } from "../constants/ApiPath";
import { useAuthStore } from "./zustand";
import { PagedUserResponse, UserSchema } from "@/api/schemas/user";
import { AnyFunction } from "@/components/shared/types/genericTypes";
import { AuthState } from "@/components/shared/types/authTypes";


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

export const useQueryUsers = (callBackFunc: AnyFunction) => {

    const queryClient = useQueryClient();
    const signedUser: UserSchema | undefined = queryClient.getQueryData(["user"]);
    if (signedUser === undefined) {
        throw new Error("(!) could not perform user query: signed user is undefined")
    }
    const { data: authData }: AuthState = useAuthStore();

    const onSuccess = (pagedData: PagedUserResponse) => {
        callBackFunc(pagedData.content.filter(user => user.id !== signedUser.id));
        console.log("user query success:", pagedData);
    }

    const onError = (error: Error) => {
        console.log("error on querying users: ", error.message);
    }

    return useMutation({
        mutationFn: async (inputText: string) => {
            return await fetchUsersByQuery(inputText, authData.accessToken);
        },
        onSuccess,
        onError,
    });
}

export const useGetUserById = (userId: string | number): UseQueryResult<UserSchema> => {

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


export const useGetFollowers = (userId: string | number): UseQueryResult<PagedUserResponse> => {
    const { data: authData } = useAuthStore();

    return useQuery<PagedUserResponse>({
        queryKey: ["followers", { id: userId }],
        queryFn: async () => {
            const response = await fetchFollowers(userId, authData.accessToken);
            return await response.json();
        },
        enabled: !!authData?.accessToken,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};


export const useGetFollowings = (userId: string | number): UseQueryResult<PagedUserResponse> => {

    const { data: authData } = useAuthStore();

    console.log("folloings")

    return useQuery({
        queryKey: ["followings", { id: userId }],
        queryFn: async () => {
            const response = await fetchFollowings(userId, authData.accessToken);
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