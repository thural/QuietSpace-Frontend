import { useCreateChat, useDeleteChat, useGetMessagesByChatId } from "@/services/data/useChatData";
import { useAuthStore, useChatStore } from "@/services/store/zustand";
import { useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useMemo, useState } from "react";
import { ChatList, CreateChat } from "@/api/schemas/inferred/chat";
import { ResId } from "@/api/schemas/inferred/common";
import { nullishValidationdError } from "@/utils/errorUtils";

export const useChat = (chatId: ResId) => {

    const { data: { userId } } = useAuthStore();
    const queryClient = useQueryClient();
    const chats: ChatList | undefined = queryClient.getQueryData(["chats"]);


    const deleteChat = useDeleteChat(chatId);
    const createChatMutation = useCreateChat();
    const { clientMethods } = useChatStore();
    const { sendChatMessage, deleteChatMessage, setMessageSeen, isClientConnected } = clientMethods;
    const { data: messages, isError, isLoading, isSuccess } = useGetMessagesByChatId(chatId);


    const currentChat = chats?.find(chat => chat.id === chatId);
    if (currentChat === undefined) throw nullishValidationdError({ currentChat });
    const { username: recipientName, id: recipientId } = currentChat.members[0] || {};



    const [inputData, setInputData] = useState({
        chatId: chatId,
        senderId: userId,
        recipientId,
        text: ''
    });



    const handleChatCreation = (recipientId: ResId, text: string, isGroupChat: boolean) => {
        const createChatRequestBody: CreateChat = {
            isGroupChat,
            recipientId,
            text,
            "userIds": [userId, recipientId]
        };
        createChatMutation.mutate(createChatRequestBody);
    };

    const createChat = () => {
        const { recipientId, text } = inputData;
        if (recipientId === undefined) throw nullishValidationdError({ recipientId });
        handleChatCreation(recipientId, text, false);
    }

    const sendMessage = () => {
        if (chatId === -1) createChat();
        sendChatMessage(inputData);
    };

    const handleInputChange = (eventData: string) => {
        setInputData({ ...inputData, text: eventData });
    }

    const handleDeleteChat = (event: ChangeEvent) => {
        event.preventDefault();
        deleteChat.mutate();
    }

    const isEnabled = useMemo(() => (isSuccess && isClientConnected), [isSuccess, isClientConnected]);






    return {
        chats,
        currentChat,
        recipientName,
        messages,
        isError,
        isLoading,
        isSuccess,
        sendMessage,
        deleteChatMessage,
        setMessageSeen,
        isClientConnected,
        inputData,
        handleInputChange,
        handleDeleteChat,
        handleChatCreation,
        isEnabled
    };
}