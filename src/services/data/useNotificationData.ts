import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/zustand";
import { fetchCountOfPendingNotifications, fetchNotifications } from "../../api/requests/notificationRequests";



export const useGetNotifications = () => {

    const { data: authData } = useAuthStore();

    return useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            return await fetchNotifications(authData.accessToken);
        },
        retry: 3,
        retryDelay: 1000,
        select: data => data.content
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
        retryDelay: 1000,
    })
}