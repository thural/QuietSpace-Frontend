import useUserQueries from "@/core/network/api/queries/userQueries";
import { fetchBlockUserById, fetchFollowers, fetchFollowings, fetchSaveSettings, fetchToggleFollow, fetchUploadPhoto, fetchUser, fetchUserById, fetchUsersByQuery } from "@features/search/data/userRequests";
import { ResId } from "@/shared/api/models/common";
import { ProfileSettingsRequest, ProfileSettingsResponse, UserPage, UserResponse } from "@/features/profile/data/models/user";
import { ConsumerFn } from "@/shared/types/genericTypes";
import { buildPageParams, getNextPageParam } from "@/shared/utils/fetchUtils";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/zustand";


export const useGetCurrentUser = () => {

    const { data: authData, isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: ["user"],
        queryFn: async (): Promise<UserResponse> => {
            return await fetchUser(authData.accessToken);
        },
        enabled: isAuthenticated,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
}


export const useQueryUsers = (callBackFunc?: ConsumerFn) => {


    const { getSignedUser } = useUserQueries();
    const signedUser = getSignedUser();

    if (signedUser === undefined) {
        throw new Error("could not perform user query, userId is undefined, ");
    }

    const { data: authData } = useAuthStore();

    const onSuccess = (pagedData: UserPage) => {
        console.log("user query success:", pagedData);
        if (callBackFunc) callBackFunc(
            pagedData.content.filter(user => user.id !== signedUser.id));
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
        queryKey: ["users", userId],
        queryFn: async (): Promise<UserResponse> => {
            return await fetchUserById(userId, authData.accessToken);
        },
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
}


export const useGetFollowers = (userId: ResId) => {
    const { data: authData, isAuthenticated } = useAuthStore();

    return useInfiniteQuery({
        queryKey: ["users", "followers", userId],
        queryFn: async ({ pageParam }): Promise<UserPage> => {
            const pageParams = buildPageParams(pageParam, 9);
            return await fetchFollowers(userId, authData.accessToken, pageParams);
        },
        initialPageParam: 0,
        getNextPageParam,
        enabled: isAuthenticated,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};


export const useGetFollowings = (userId: ResId) => {

    const { data: authData, isAuthenticated } = useAuthStore();

    return useInfiniteQuery({
        queryKey: ["users", "followings", userId],
        queryFn: async ({ pageParam }): Promise<UserPage> => {
            const pageParams = buildPageParams(pageParam, 9);
            return await fetchFollowings(userId, authData.accessToken, pageParams);
        },
        initialPageParam: 0,
        getNextPageParam,
        enabled: isAuthenticated,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
}


export const useToggleFollow = (userId: ResId) => {

    const queryClient = useQueryClient();
    const { data: authData } = useAuthStore();

    const onSuccess = (data: any) => {
        console.log("toggle follow success response:", data);
        queryClient.invalidateQueries({ queryKey: ["followings", userId] });
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

    const onSuccess = (data: any) => {
        console.log("block user response:", data);
        queryClient.invalidateQueries({ queryKey: ["followings", userId] });
        queryClient.invalidateQueries({ queryKey: ["followers", userId] });
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

    const onSuccess = (data: any) => {
        console.log("save profile settings success response:", data);
        queryClient.invalidateQueries({ queryKey: ["user"] });
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

export const useUploadProfilePhoto = (toggleForm: ConsumerFn) => {

    const queryClient = useQueryClient();
    const { data: authData } = useAuthStore();

    const onSuccess = (data: any) => {
        console.log("upload profile photo success response:", data);
        queryClient.invalidateQueries({ queryKey: ["user"] });
        toggleForm();
    }

    const onError = (error: Error) => {
        console.log("error on uploading user profile photo: ", error.message);
        alert(`error on uploading user profile photo: ", ${error.message}`);
        toggleForm();
    }

    return useMutation({
        mutationFn: async (formData: FormData): Promise<string> => {
            return await fetchUploadPhoto(formData, authData.accessToken);
        },
        onSuccess,
        onError,
    });
}