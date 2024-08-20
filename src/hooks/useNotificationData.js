import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "./zustand";
import { fetchCountOfPendingNotifications, fetchNotifications, fetchNotificationsByType } from "../api/notificationRequests";



export const useGetNotifications = () => {

    const { data: authData } = useAuthStore();

    const onSuccess = (data, variables, context) => {
        console.log("fetched notifications successfully:", data);
    }

    const onError = (error, variables, context) => {
        console.log("error on fetching notifications: ", error.message);
    }

    return useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const response = await fetchNotifications(authData.accessToken);
            return await response.json();
        },
        onSuccess,
        onError,
        retry: 3,
        retryDelay: 1000,
        select: data => data.content
    });
}

export const useGetNotificationsByType = (type) => {

    const { data: authData } = useAuthStore();

    const onSuccess = (data, variables) => {
        console.log("fetched notification by type successfully:", data);
    }

    const onError = (error, variables) => {
        console.log("error on fetching notification by type: ", error.message);
    }

    return useQuery({
        queryKey: ["notifications", { type }],
        queryFn: async () => {
            const response = await fetchNotificationsByType(type, authData.accessToken);
            return await response.json();
        },
        onSuccess,
        onError,
        retry: 3,
        retryDelay: 1000,
        select: data => data.content
    });
}

export const countPendingNotifications = () => {

    const { data: authData } = useAuthStore();

    const onSuccess = (data, variables, context) => {
        console.log("fetched notification count successfully:", data);
    }

    const onError = (error, variables, context) => {
        console.log("error on fetching notification count: ", error.message);
    }

    return useMutation({
        mutationFn: async () => {
            const response = await fetchCountOfPendingNotifications(authData.accessToken);
            return await response.json();
        },
        onSuccess,
        onError,
        retry: 3,
        retryDelay: 1000,
        staleTime: 1000 * 60 * 6, // keep data fresh up to 6 minutes
        refetchInterval: 1000 * 60 * 3, // refetch data after 3 minutes on idle
    })
}