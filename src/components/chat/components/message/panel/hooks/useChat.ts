import { useDeleteChat, useGetMessagesByChatId } from "@/hooks/data/useChatData";
import { useAuthStore, useChatStore } from "@/hooks/zustand";
import { useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useMemo, useState } from "react";
import { ChatList } from "@/api/schemas/inferred/chat";

export const useChat = () => {
    const queryClient = useQueryClient();
    const { data: { userId } } = useAuthStore();
    const chats: ChatList | undefined = queryClient.getQueryData(["chats"]);
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

    const handleInputChange = (eventData: string) => {
        setInputData({ ...inputData, text: eventData });
    }

    const handleDeleteChat = (event: ChangeEvent) => {
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