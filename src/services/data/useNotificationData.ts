import { buildPageParams, getNextPageParam } from "@/utils/fetchUtils";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { fetchCountOfPendingNotifications, fetchNotifications } from "@/api/requests/notificationRequests";
import { useAuthStore } from "../store/zustand";



export const useGetNotifications = () => {

    const { data: authData, isAuthenticated } = useAuthStore();

    return useInfiniteQuery({
        queryKey: ["notifications"],
        queryFn: async ({ pageParam }) => {
            const pageParams = buildPageParams(pageParam, 9);
            return await fetchNotifications(authData.accessToken, pageParams);
        },
        initialPageParam: 0,
        getNextPageParam,
        enabled: isAuthenticated,
        retry: 3,
        retryDelay: 1000,
        staleTime: 1000 * 60 * 3,
        refetchInterval: 1000 * 60 * 6,
        gcTime: 1000 * 60 * 15,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchIntervalInBackground: false,
    });
}

export const countPendingNotifications = () => {

    const { data: authData } = useAuthStore();

    const onSuccess = (data: number) => {
        console.log("fetched notification count:", data);
    }

    const onError = (error: Error) => {
        console.log("error on fetching notification count: ", error.message);
    }

    return useMutation({
        mutationFn: async (): Promise<number> => {
            return await fetchCountOfPendingNotifications(authData.accessToken);
        },
        onSuccess,
        onError,
        retry: 3,
        retryDelay: 1000
    })
}