import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../zustand";
import { fetchChatById, fetchChatByUserId, fetchCreateChat, fetchDeleteChat } from "../../api/requests/chatRequests";
import { fetchCreateMessage, fetchDeleteMessage, fetchMessages } from "../../api/requests/messageRequests";
import { ResId } from "@/api/schemas/inferred/common";
import { ChatList, Chat, CreateChat, MessageBody, Message, PagedMessage } from "@/api/schemas/inferred/chat";
import { User } from "@/api/schemas/inferred/user";
import { nullishValidationdError } from "@/utils/errorUtils";
import { ConsumerFn } from "@/types/genericTypes";


export const useGetChatsByUserId = (userId: ResId) => {

    const { data: authData } = useAuthStore();

    return useQuery({
        queryKey: ["chats"],
        queryFn: async (): Promise<ChatList> => {
            return await fetchChatByUserId(userId, authData.accessToken);
        },
        retry: 3,
        retryDelay: 1000,
        enabled: !!userId,
        staleTime: 1000 * 60 * 6,
        refetchInterval: 1000 * 60 * 3,
    });
}


export const useGetChatById = (chatId: ResId) => {

    const { data: authData } = useAuthStore();

    return useQuery({
        queryKey: ["chats", { id: chatId }],
        queryFn: async (): Promise<Chat> => {
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
    const queryClient = useQueryClient();

    const onSuccess = (data: Chat) => {
        queryClient.invalidateQueries({ queryKey: ["chats"] });
        console.log("chat created successfully:", data);
    }

    const onError = (error: Error) => {
        console.log("error on fetching created chat: ", error.message);
    }

    return useMutation({
        mutationFn: async (chatBody: CreateChat): Promise<Chat> => {
            return await fetchCreateChat(chatBody, authData.accessToken);
        },
        onSuccess,
        onError,
    })
}


export const useGetMessagesByChatId = (chatId: ResId) => {

    const { data: authData } = useAuthStore();
    const queryClient = useQueryClient();
    const user: User | undefined = queryClient.getQueryData(["user"]);

    if (user === undefined) throw nullishValidationdError({ user });

    return useQuery({
        queryKey: ["messages", { id: chatId }],
        queryFn: async (): Promise<PagedMessage> => {
            const responseData = await fetchMessages(chatId, authData.accessToken);
            console.log("messages response data: ", responseData);
            return responseData;
        },
        retry: 3,
        retryDelay: 1000,
        select: (data) => data.content,
        enabled: !!user.id && !!chatId,
        staleTime: 1000 * 60 * 3,
        refetchInterval: 1000 * 60 * 6
    });
}


export const usePostNewMessage = (setMessageData: ConsumerFn) => {
    const { data: authData } = useAuthStore();
    const queryClient = useQueryClient();

    const onSuccess = (data: Message, variables: MessageBody) => {
        queryClient.invalidateQueries({ queryKey: ["messages", data.chatId] });
        setMessageData({ ...variables, text: '' });
        console.log("message sent successfully:", data);
    };

    const onError = (error: Error) => {
        console.log("error on sending message: ", error.message);
    };

    return useMutation({
        mutationFn: async (messageData): Promise<Message> => {
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


export const useDeleteChat = (chatId: ResId) => {

    const { data: authData } = useAuthStore();
    const queryClient = useQueryClient();

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["chats"] })
            .then(() => console.log("chat cache was invalidated"));
        console.log("chat cache was invalidated");
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