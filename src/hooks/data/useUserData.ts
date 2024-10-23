import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { fetchFollowers, fetchFollowings, fetchToggleFollow, fetchUser, fetchUserById, fetchUsersByQuery } from "../../api/userRequests";
import { useAuthStore } from "../zustand";
import { PagedUserResponse, UserSchema } from "@/api/schemas/user";
import { ConsumerFn } from "@/types/genericTypes";
import { produceUndefinedError } from "@/utils/errorUtils";
import { ResId } from "@/api/schemas/common";


export const useGetCurrentUser = () => {

    const { data: authData } = useAuthStore();

    return useQuery({
        queryKey: ["user"],
        queryFn: async (): Promise<UserSchema> => {
            return await fetchUser(authData.accessToken);
        },
        enabled: !!authData?.accessToken,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
}


export const useQueryUsers = (callBackFunc: ConsumerFn) => {

    const queryClient = useQueryClient();
    const signedUser: UserSchema | undefined = queryClient.getQueryData(["user"]);

    if (signedUser === undefined) {
        throw produceUndefinedError({ signedUser }, "could not perform user query:");
    }

    const { data: authData } = useAuthStore();

    const onSuccess = (pagedData: PagedUserResponse) => {
        console.log("user query success:", pagedData);
        callBackFunc(pagedData.content.filter(user => user.id !== signedUser.id));
    }

    const onError = (error: Error) => {
        console.log("error on querying users: ", error.message);
    }

    return useMutation({
        mutationFn: async (inputText: string): Promise<PagedUserResponse> => {
            return await fetchUsersByQuery(inputText, authData.accessToken);
        },
        onSuccess,
        onError,
    });
}


export const useGetUserById = (userId: ResId) => {

    const { data: authData } = useAuthStore();

    return useQuery({
        queryKey: ["users", { id: userId }],
        queryFn: async (): Promise<UserSchema> => {
            return await fetchUserById(userId, authData.accessToken);
        },
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
}


export const useGetFollowers = (userId: ResId) => {
    const { data: authData } = useAuthStore();

    return useQuery<PagedUserResponse>({
        queryKey: ["followers", { id: userId }],
        queryFn: async (): Promise<PagedUserResponse> => {
            return await fetchFollowers(userId, authData.accessToken);
        },
        enabled: !!authData?.accessToken,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};


export const useGetFollowings = (userId: ResId) => {

    const { data: authData } = useAuthStore();

    return useQuery({
        queryKey: ["followings", { id: userId }],
        queryFn: async (): Promise<PagedUserResponse> => {
            return await fetchFollowings(userId, authData.accessToken);
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

    const onSuccess = (data: Response) => {
        console.log("toggle follow success response:", data);
        queryClient.invalidateQueries({ queryKey: ["followings", "followers"] })
    }

    const onError = (error: Error) => {
        console.log("error on toggling follow: ", error.message);
    }

    return useMutation({
        mutationFn: async (userId: ResId): Promise<Response> => {
            return await fetchToggleFollow(userId, authData.accessToken);
        },
        onSuccess,
        onError,
    });
}