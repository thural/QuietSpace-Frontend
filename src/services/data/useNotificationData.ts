import { NotificationPage } from "@/api/schemas/inferred/notification";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchCountOfPendingNotifications, fetchNotifications } from "../../api/requests/notificationRequests";
import { useAuthStore } from "../store/zustand";



export const useGetNotifications = () => {

    const { data: authData, isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: ["notifications"],
        queryFn: async (): Promise<NotificationPage> => {
            return await fetchNotifications(authData.accessToken);
        },
        enabled: isAuthenticated,
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