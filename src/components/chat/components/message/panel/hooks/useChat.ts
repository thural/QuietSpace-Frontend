import { useDeleteChat, useGetMessagesByChatId } from "@hooks/useChatData";
import { useAuthStore, useChatStore } from "@hooks/zustand";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export const useChat = () => {
    const queryClient = useQueryClient();
    const { data: { userId } } = useAuthStore();
    const chats = queryClient.getQueryData(["chats"]);
    const { data: { activeChatId }, clientMethods } = useChatStore();
    const deleteChat = useDeleteChat(activeChatId);

    const currentChat = chats?.find(chat => chat.id === activeChatId);
    const { username: recipientName, id: recipientId } = currentChat?.members[0] || {};
    const { data: messages, isError, isLoading, isSuccess } = useGetMessagesByChatId(activeChatId);
    const { sendChatMessage, deleteChatMessage, setMessageSeen, isClientConnected } = clientMethods;

    const [inputData, setInputData] = useState({
        chatId: activeChatId,
        senderId: userId,
        recipientId,
        text: ''
    });

    const handleInputChange = (event) => {
        setInputData({ ...inputData, text: event });
    }

    const handleDeleteChat = (event) => {
        event.preventDefault();
        deleteChat.mutate();
    }

    const enabled = useMemo(() => (isSuccess && isClientConnected), [isSuccess, isClientConnected]);

    return {
        chats,
        activeChatId,
        currentChat,
        recipientName,
        messages,
        isError,
        isLoading,
        isSuccess,
        sendChatMessage,
        deleteChatMessage,
        setMessageSeen,
        isClientConnected,
        inputData,
        handleInputChange,
        handleDeleteChat,
        enabled
    };
}