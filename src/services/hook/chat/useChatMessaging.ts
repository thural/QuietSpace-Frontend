import { CreateChatRequest } from "@/api/schemas/inferred/chat";
import { ResId } from "@/api/schemas/native/common";
import { useCreateChat, useGetChats } from "@/services/data/useChatData";
import { useAuthStore, useChatStore } from "@/services/store/zustand";
import { useCallback } from "react";


export const useChatMessaging = () => {
    const { data: { userId: senderId } } = useAuthStore();
    const { clientMethods } = useChatStore();
    const { sendChatMessage, isClientConnected } = clientMethods;
    const chats = useGetChats();
    const createChatMutation = useCreateChat();

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
            sendChatMessage({
                chatId,
                senderId,
                recipientId,
                text
            });

            if (postId) {
                sendChatMessage({
                    chatId,
                    senderId,
                    recipientId,
                    text: `##MP## ${postId}`
                });
            }
        }
    }, [senderId, sendChatMessage, findOrCreateChat]);

    return {
        sendMessage,
        isClientConnected,
        findOrCreateChat
    };
};