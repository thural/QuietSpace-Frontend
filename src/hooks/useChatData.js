import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authStore } from "./zustand";
import { CHAT_PATH_BY_MEMBER, LOGIN_URL, MESSAGE_PATH, SIGNUP_URL } from "../constants/ApiPath";
import { fetchSignup } from "../api/authRequests";
import { fetchChats } from "../api/chatRequests";
import { fetchCreateMessage, fetchDeleteMessage, fetchMessages } from "../api/messageRequests";

export const useGetChats = (userId) => {

    const { data: authData } = authStore();

    return useQuery({
        queryKey: ["chats"],
        queryFn: async () => {
            const response = await fetchChats(CHAT_PATH_BY_MEMBER, userId, authData["token"]);
            return await response.json();
        },
        retry: 3,
        retryDelay: 1000,
        enabled: !!userId, // if userQuery could fetch the current user
        staleTime: 1000 * 60 * 6, // keep data fresh up to 6 minutes
        refetchInterval: 1000 * 3, // refetch data after 3 minutes on idle
    });
}

export const useGetMessagesByChatId = (chatId) => {
    const { data: authData } = authStore();
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);

    return useQuery({
        queryKey: ["messages"],
        queryFn: async () => {
            const response = await fetchMessages(MESSAGE_PATH, chatId, authData.token);
            return await response.json();
        },
        retry: 3,
        retryDelay: 1000,
        select: (data) => data.content,
        enabled: !!user.id && !!chatId, // if userQuery could fetch the current user
        staleTime: 1000 * 60 * 3, // keep data fresh up to 6 minutes
        refetchInterval: 1000 * 60 * 6 // refetch data after 6 minutes on idle
    });
}

export const usePostNewMessage = (messageData, setMessageData) => {

    const { data: authData } = authStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await fetchCreateMessage(MESSAGE_PATH, messageData, authData["token"]);
            return response.json();
        },
        onSuccess: (data, variables, context) => {
            queryClient.setQueryData(["messages", data.id], messageData); // manually cache data before refetch
            setMessageData({ ...messageData, text: '' });
            console.log("message sent successfully:", data);
        },
        onError: (error, variables, context) => {
            console.log("error on sending message: ", error.message);
        },
    });
}

export const useDeleteMessage = (chatId) => {

    const { data: authData } = authStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await fetchDeleteMessage(MESSAGE_PATH, authData["token"], id);
            return response.json();
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries(["chats"], { id: chatId }, { exact: true });
            console.log("delete message sucess");
        },
        onError: (error, variables, context) => {
            console.log("error on deleting message: ", error.message);
        },
    });
}

export const useLogoutPost = () => {

    const queryClient = useQueryClient();
    const { setAuthData } = authStore();

    const onSuccess = (data, variables, context) => {
        queryClient.invalidateQueries(["posts", "user", "chat"]);
        queryClient.resetQueries("auth");
        console.log("user logout was success");
        setAuthData({ message: "", token: "", userId: "" });
    }

    const onError = (error, variables, context) => {
        console.log("error on logout:", error.message);
        setAuthData({ message: "", token: "", userId: "" });
    }

    return useMutation({
        mutationFn: async () => {
            const response = await fetchLogout(LOGOUT_URL, auth["token"]);
            return await response.json();
        },
        onSuccess,
        onError
    });
}

export const usePostSignup = () => {

    const queryClient = useQueryClient();
    const { setAuthData } = authStore();

    const onSuccess = (data, variables, context) => {
        queryClient.invalidateQueries(["posts", "user", "chats"]);
        queryClient.setQueryData("auth", data);
        setAuthData(data);
    }

    const onError = (error, variables, context) => {
        console.log("error on signup:", error.message)
    }

    return useMutation({
        mutationFn: async (formData) => {
            const response = await fetchSignup(SIGNUP_URL, formData);
            return await response.json();
        },
        onSuccess,
        onError
    });
}