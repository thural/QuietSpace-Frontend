import chatQueries from "@/api/queries/chatQueries";
import { ChatResponse, CreateChatRequest } from "@/api/schemas/inferred/chat";
import { ResId } from "@/api/schemas/native/common";
import { useCreateChat, useGetChats } from "@/services/data/useChatData";
import { useAuthStore, useChatStore } from "@/services/store/zustand";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";


export const useChatMessaging = () => {

    const { data: { userId: senderId } } = useAuthStore();
    const { clientMethods } = useChatStore();
    const { sendChatMessage, isClientConnected } = clientMethods;
    const chats = useGetChats();
    const navigate = useNavigate();
    const { updateInitChatCache } = chatQueries();



    const onSuccess = (data: ChatResponse) => {
        console.log("chat created successfully:", data);
        updateInitChatCache(data);
        navigate(`/chat/${data.id}`);
    };

    const onError = (error: Error) => {
        console.log("error on fetching created chat: ", error.message);
    };

    const createChatMutation = useCreateChat({ onSuccess, onError });



    const findOrCreateChat = useCallback((recipientId: ResId, text?: string) => {
        const existingChat = chats.data?.find(chat =>
            chat.members.some(member => member.id === recipientId)
        );

        if (existingChat) return existingChat.id;

        const createChatRequestBody: CreateChatRequest = {
            isGroupChat: false,
            recipientId,
            text: text || '',
            userIds: [senderId, recipientId]
        };
        createChatMutation.mutate(createChatRequestBody);

        return undefined;
    }, [chats.data, senderId, createChatMutation]);



    const sendMessage = useCallback((params: {
        recipientId: ResId,
        text: string,
        postId?: ResId
    }) => {
        const { recipientId, text, postId } = params;
        const chatId = findOrCreateChat(recipientId, text);

        if (chatId) {
            sendChatMessage({ chatId, senderId, recipientId, text });

            if (postId) {
                sendChatMessage({ chatId, senderId, recipientId, text: `##MP## ${postId}` });
            }
        }
    }, [senderId, sendChatMessage, findOrCreateChat]);



    return {
        sendMessage,
        isClientConnected,
        findOrCreateChat
    };
};