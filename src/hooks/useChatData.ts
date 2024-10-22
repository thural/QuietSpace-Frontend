import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "./zustand";
import { CHAT_PATH, CHAT_PATH_BY_MEMBER, MESSAGE_PATH } from "../constants/ApiPath";
import { fetchChatById, fetchChatByUserId, fetchCreateChat, fetchDeleteChat } from "../api/chatRequests";
import { fetchCreateMessage, fetchDeleteMessage, fetchMessages } from "../api/messageRequests";

export const useGetChatsByUserId = (userId) => {

    const { data: authData } = useAuthStore();

    return useQuery({
        queryKey: ["chats"],
        queryFn: async () => {
            return await fetchChatByUserId(userId, authData.accessToken);
        },
        retry: 3,
        retryDelay: 1000,
        enabled: !!userId, // if userQuery could fetch the current user
        staleTime: 1000 * 60 * 6, // keep data fresh up to 6 minutes
        refetchInterval: 1000 * 60 * 3, // refetch data after 3 minutes on idle
    });
}

export const useGetChatById = (chatId) => {

    const { data: authData } = useAuthStore();

    return useQuery({
        queryKey: ["chats", { id: chatId }],
        queryFn: async () => {
            return await fetchChatById(chatId, authData.accessToken);
        },
        retry: 3,
        retryDelay: 1000,
        staleTime: 1000 * 60 * 6, // keep data fresh up to 6 minutes
        refetchInterval: 1000 * 60 * 3, // refetch data after 3 minutes on idle
        select: data => data.content
    });
}

export const useCreateChat = () => {

    const { data: authData } = useAuthStore();
    const queryClient = useQueryClient();

    const onSuccess = (data, variables, context) => {
        queryClient.invalidateQueries(["chats"]);
        console.log("chat created successfully:", data);
    }

    const onError = (error, variables, context) => {
        console.log("error on fetching created chat: ", error.message);
    }

    return useMutation({
        mutationFn: async (chatBody) => {
            return await fetchCreateChat(chatBody, authData.accessToken);
        },
        onSuccess,
        onError,
    })
}

export const useGetMessagesByChatId = (chatId) => {

    const { data: authData } = useAuthStore();
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);

    return useQuery({
        queryKey: ["messages", { id: chatId }],
        queryFn: async () => {
            const responseData = await fetchMessages(chatId, authData.accessToken);
            console.log("messages response data: ", responseData);
            return responseData;
        },
        retry: 3,
        retryDelay: 1000,
        select: (data) => data.content,
        enabled: !!user.id && !!chatId, // if userQuery could fetch the current user
        staleTime: 1000 * 60 * 3, // keep data fresh up to 6 minutes
        refetchInterval: 1000 * 60 * 6 // refetch data after 6 minutes on idle,
    });
}

export const usePostNewMessage = (setMessageData) => {

    const { data: authData } = useAuthStore();
    const queryClient = useQueryClient();

    const onSuccess = (data, variables, context, messageData) => {
        queryClient.invalidateQueries(["messages"], { id: data.id });
        setMessageData({ ...messageData, text: '' });
        console.log("message sent successfully:", data);
    }

    const onError = (error, variables, context) => {
        console.log("error on sending message: ", error.message);
    }

    return useMutation({
        mutationFn: async (messageData) => {
            console.log("current chat id on sending: ", messageData.chatId);
            return await fetchCreateMessage(messageData, authData["accessToken"]);
        },
        onSuccess,
        onError,
    });
}

export const useDeleteMessage = (messageId) => {

    const { data: authData } = useAuthStore();
    const queryClient = useQueryClient();

    const onSuccess = (data, variables, context) => {
        queryClient.invalidateQueries(["messages"], { id: messageId });
        console.log("delete message success");
    }

    const onError = (error, variables, context) => {
        console.log("error on deleting message: ", error.message);
    }

    return useMutation({
        mutationFn: async (messageId) => {
            return await fetchDeleteMessage(authData["accessToken"], messageId);
        },
        onSuccess,
        onError,
    });

}

export const useDeleteChat = chatId => {

    const { data: authData } = useAuthStore();
    const queryClient = useQueryClient();

    const onSuccess = (data, variables, context) => {
        queryClient.invalidateQueries(["chats"], { id: chatId })
            .then(() => console.log("chat cache was invalidated"));
        console.log("chat cache was invalidated");
    }

    const onError = (error, variables, context) => {
        console.log("error on deleting chat: ", error.message);
    }

    return useMutation({
        mutationFn: async () => {
            return await fetchDeleteChat(chatId, authData["accessToken"]);
        },
        onSuccess,
        onError,
    });

}