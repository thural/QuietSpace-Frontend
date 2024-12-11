import { fetchChatByUserId, fetchCreateChat, fetchDeleteChat } from "@/api/requests/chatRequests";
import { fetchMessages } from "@/api/requests/messageRequests";
import { ChatList, ChatResponse, CreateChatRequest, PagedMessage } from "@/api/schemas/inferred/chat";
import { ResId } from "@/api/schemas/inferred/common";
import { QueryProps } from "@/types/hookPropTypes";
import { buildPageParams, getNextPageParam } from "@/utils/fetchUtils";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
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


export const useCreateChat = ({
    onSuccess,
    onError,
}: {
    onSuccess?: (data: ChatResponse) => void;
    onError?: (error: Error) => void;
}) => {
    const { data: authData } = useAuthStore();

    return useMutation({
        mutationFn: async (chatBody: CreateChatRequest): Promise<ChatResponse> => {
            return await fetchCreateChat(chatBody, authData.accessToken);
        },
        onSuccess,
        onError,
    });
};


export const useGetMessagesByChatId = (chatId: ResId) => {
    const { data: authData, isAuthenticated } = useAuthStore();
    return useInfiniteQuery({
        queryKey: ["chats", chatId, "messages"],
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


export interface UseDeleteChatProps extends QueryProps {
    chatId: ResId;
}
export const useDeleteChat = ({
    chatId, onSuccess, onError,
}: UseDeleteChatProps) => {
    if (chatId === undefined) throw new Error("chatId is undefined");
    const { data: authData } = useAuthStore();
    return useMutation({
        mutationFn: async (): Promise<Response> => {
            return await fetchDeleteChat(chatId, authData.accessToken);
        },
        onSuccess,
        onError,
    });
}