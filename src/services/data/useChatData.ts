import chatQueries from "@/api/queries/chatQueries";
import { ChatResponse, ChatList, CreateChatRequest, MessageResponse, MessageRequest, PagedMessage } from "@/api/schemas/inferred/chat";
import { ResId } from "@/api/schemas/inferred/common";
import { ConsumerFn } from "@/types/genericTypes";
import { assertNullisValues } from "@/utils/errorUtils";
import { buildPageParams, getNextPageParam } from "@/utils/fetchUtils";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchChatById, fetchChatByUserId, fetchCreateChat, fetchDeleteChat } from "../../api/requests/chatRequests";
import { fetchCreateMessage, fetchDeleteMessage, fetchMessages } from "../../api/requests/messageRequests";
import { useAuthStore } from "../store/zustand";


export const useGetChats = () => {

    const { data: authData, isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: ["chats"],
        queryFn: async (): Promise<ChatList> => {
            return await fetchChatByUserId(authData.userId, authData.accessToken);
        },
        retry: 3,
        retryDelay: 1000,
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 6,
        refetchInterval: 1000 * 60 * 3,
    });
}


export const useGetChatById = (chatId: ResId) => {

    const { data: authData } = useAuthStore();

    return useQuery({
        queryKey: ["chats", { id: chatId }],
        queryFn: async (): Promise<ChatResponse> => {
            return await fetchChatById(chatId, authData.accessToken);
        },
        retry: 3,
        retryDelay: 1000,
        staleTime: 1000 * 60 * 6,
        refetchInterval: 1000 * 60 * 3,
    });
}


export const useCreateChat = () => {

    const { data: authData } = useAuthStore();
    const navigate = useNavigate();
    const { updateInitChatCache } = chatQueries();

    const onSuccess = (data: ChatResponse) => {
        console.log("chat created successfully:", data);
        updateInitChatCache(data);
        navigate(`/chat/${data.id}`);
    }

    const onError = (error: Error) => {
        console.log("error on fetching created chat: ", error.message);
    }

    return useMutation({
        mutationFn: async (chatBody: CreateChatRequest): Promise<ChatResponse> => {
            return await fetchCreateChat(chatBody, authData.accessToken);
        },
        onSuccess,
        onError,
    })
}


export const useGetMessagesByChatId = (chatId: ResId) => {

    const { data: authData, isAuthenticated } = useAuthStore();

    return useInfiniteQuery({
        queryKey: ["messages", { id: chatId }],
        queryFn: async ({ pageParam }): Promise<PagedMessage> => {
            const pageParams = buildPageParams(pageParam, 9);
            return await fetchMessages(chatId, authData.accessToken, pageParams);
        },
        select: (data) => data?.pages.flatMap((page) => page.content),
        retry: 3,
        initialPageParam: 0,
        getNextPageParam,
        retryDelay: 1000,
        enabled: isAuthenticated && !!chatId,
        staleTime: 1000 * 60 * 3,
        refetchInterval: 1000 * 60 * 6
    });
}


export const usePostNewMessage = (setMessageData: ConsumerFn) => {
    const { data: authData } = useAuthStore();
    const queryClient = useQueryClient();

    const onSuccess = (data: MessageResponse, variables: MessageRequest) => {
        queryClient.invalidateQueries({ queryKey: ["messages", data.chatId] });
        setMessageData({ ...variables, text: '' });
        console.log("message sent successfully:", data);
    };

    const onError = (error: Error) => {
        console.log("error on sending message: ", error.message);
    };

    return useMutation({
        mutationFn: async (messageData): Promise<MessageResponse> => {
            console.log("current chat id on sending: ", messageData.chatId);
            return await fetchCreateMessage(messageData, authData["accessToken"]);
        },
        onSuccess,
        onError,
    });
};


export const useDeleteMessage = (chatId: ResId) => {

    const { data: authData } = useAuthStore();
    const queryClient = useQueryClient();

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
        console.log("delete message success");
    }

    const onError = (error: Error) => {
        console.log("error on deleting message: ", error.message);
    }

    return useMutation({
        mutationFn: async (messageId: ResId): Promise<Response> => {
            return await fetchDeleteMessage(authData["accessToken"], messageId);
        },
        onSuccess,
        onError,
    });

}


export const useDeleteChat = (chatId: ResId | undefined) => {

    if (chatId === undefined) throw assertNullisValues({ chatId });

    const { data: authData } = useAuthStore();
    const queryClient = useQueryClient();

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["chats"] })
            .then(() => console.log("chat cache was invalidated"));
    }

    const onError = (error: Error) => {
        console.log("error on deleting chat: ", error.message);
    }

    return useMutation({
        mutationFn: async (): Promise<Response> => {
            return await fetchDeleteChat(chatId, authData.accessToken);
        },
        onSuccess,
        onError,
    });
}