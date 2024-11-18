import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchBlockUserById, fetchFollowers, fetchFollowings, fetchSaveSettings, fetchToggleFollow, fetchUser, fetchUserById, fetchUsersByQuery } from "../../api/requests/userRequests";
import { useAuthStore } from "../store/zustand";
import { UserPage, User, ProfileSettingsRequest, ProfileSettingsResponse } from "@/api/schemas/inferred/user";
import { ConsumerFn } from "@/types/genericTypes";
import { nullishValidationdError } from "@/utils/errorUtils";
import { ResId } from "@/api/schemas/inferred/common";
import { getSignedUser } from "@/api/queries/userQueries";


export const useGetCurrentUser = () => {

    const { data: authData } = useAuthStore();

    return useQuery({
        queryKey: ["user"],
        queryFn: async (): Promise<User> => {
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

    const signedUser = getSignedUser();

    if (signedUser === undefined) {
        throw nullishValidationdError({ signedUser }, "could not perform user query:");
    }

    const { data: authData } = useAuthStore();

    const onSuccess = (pagedData: UserPage) => {
        console.log("user query success:", pagedData);
        callBackFunc(pagedData.content.filter(user => user.id !== signedUser.id));
    }

    const onError = (error: Error) => {
        console.log("error on querying users: ", error.message);
    }

    return useMutation({
        mutationFn: async (inputText: string): Promise<UserPage> => {
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
        queryFn: async (): Promise<User> => {
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

    return useQuery<UserPage>({
        queryKey: ["followers", { id: userId }],
        queryFn: async (): Promise<UserPage> => {
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
        queryFn: async (): Promise<UserPage> => {
            return await fetchFollowings(userId, authData.accessToken);
        },
        enabled: !!authData?.accessToken,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
}


export const useToggleFollow = (userId: ResId) => {

    const queryClient = useQueryClient();
    const { data: authData } = useAuthStore();

    const onSuccess = (data: Response) => {
        console.log("toggle follow success response:", data);
        queryClient.invalidateQueries({ queryKey: ["followings", { id: userId }] });
        queryClient.invalidateQueries({ queryKey: ["followers", { id: userId }] });
        queryClient.invalidateQueries({ queryKey: ["users", { id: userId }] });
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

export const useBlockUser = (userId: ResId) => {

    const queryClient = useQueryClient();
    const { data: authData } = useAuthStore();

    const onSuccess = (data: Response) => {
        console.log("toggle follow success response:", data);
        queryClient.invalidateQueries({ queryKey: ["followings", { id: userId }] });
        queryClient.invalidateQueries({ queryKey: ["followers", { id: userId }] });
        queryClient.invalidateQueries({ queryKey: ["users", { id: userId }] });
    }

    const onError = (error: Error) => {
        console.log("error on blocking user: ", error.message);
    }

    return useMutation({
        mutationFn: async (userId: ResId): Promise<Response> => {
            return await fetchBlockUserById(userId, authData.accessToken);
        },
        onSuccess,
        onError,
    });
}

export const useSaveProfileSettings = (userId: ResId) => {

    const queryClient = useQueryClient();
    const { data: authData } = useAuthStore();

    const onSuccess = (data: Response) => {
        console.log("save profile settings success response:", data);
        queryClient.invalidateQueries({ queryKey: ["users", { id: userId }] });
    }

    const onError = (error: Error) => {
        console.log("error on saving user profile settings: ", error.message);
    }

    return useMutation({
        mutationFn: async (settingsForm: ProfileSettingsRequest): Promise<ProfileSettingsResponse> => {
            return await fetchSaveSettings(settingsForm, authData.accessToken);
        },
        onSuccess,
        onError,
    });
}