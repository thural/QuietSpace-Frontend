import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/zustand";
import { fetchCountOfPendingNotifications, fetchNotifications } from "../../api/requests/notificationRequests";
import { PagedNotificationResponse } from "@/api/schemas/native/notification";



export const useGetNotifications = () => {

    const { data: authData } = useAuthStore();

    return useQuery({
        queryKey: ["notifications"],
        queryFn: async (): Promise<PagedNotificationResponse> => {
            return await fetchNotifications(authData.accessToken);
        },
        retry: 3,
        retryDelay: 1000
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