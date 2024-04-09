import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authStore } from "./zustand";
import { CHAT_PATH_BY_MEMBER, MESSAGE_PATH } from "../constants/ApiPath";
import { fetchChats, fetchCreateChat } from "../api/chatRequests";
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

export const useCreateChat = (setCurrentChatId) => {

    const { data: authData } = authStore();
    const queryClient = useQueryClient();

    const onSuccess = (data, variables, context) => {
        queryClient.setQueryData(["chats", data.id], chatBody); // manually cache data
        setCurrentChatId(chatData["id"]);
        console.log("chat created successfully:", data);
    }

    const onError = (error, variables, context) => {
        console.log("error on fetching created chat: ", error.message);
    }

    return useMutation({
        mutationFn: async (chatBody) => {
            const response = await fetchCreateChat(CHAT_PATH, chatBody, authData.token);
            return await response.json();
        },
        onSuccess,
        onError,
    })
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

export const usePostNewMessage = (setMessageData) => {

    const { data: authData } = authStore();
    const queryClient = useQueryClient();

    const onSuccess = (data, variables, context, messageData) => {
        queryClient.setQueryData(["messages", data.id], messageData); // manually cache data before refetch
        setMessageData({ ...messageData, text: '' });
        console.log("message sent successfully:", data);
    }

    const onError = (error, variables, context) => {
        console.log("error on sending message: ", error.message);
    }


    return useMutation({
        mutationFn: async (messageData) => {
            console.log("current chat id on sending: ", messageData.chatId);
            const response = await fetchCreateMessage(MESSAGE_PATH, messageData, authData["token"]);
            return response.json();
        },
        onSuccess,
        onError,
    });
}

export const useDeleteMessage = (chatId) => {

    const { data: authData } = authStore();
    const queryClient = useQueryClient();

    const onSuccess = (data, variables, context) => {
        queryClient.invalidateQueries(["chats"], { id: chatId }, { exact: true });
        console.log("delete message sucess");
    }

    const onError = (error, variables, context) => {
        console.log("error on deleting message: ", error.message);
    }

    return useMutation({
        mutationFn: async () => {
            const response = await fetchDeleteMessage(MESSAGE_PATH, authData["token"], id);
            return response.json();
        },
        onSuccess,
        onError,
    });
}