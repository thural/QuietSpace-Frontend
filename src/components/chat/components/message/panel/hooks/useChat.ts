import { useDeleteChat, useGetMessagesByChatId } from "@/services/data/useChatData";
import { useAuthStore, useChatStore } from "@/services/store/zustand";
import { useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useMemo, useState } from "react";
import { ChatList } from "@/api/schemas/inferred/chat";
import { nullishValidationdError } from "@/utils/errorUtils";
import { useParams } from "react-router-dom";

export const useChat = () => {

    const { chatId } = useParams();
    if (chatId === undefined) throw nullishValidationdError({ chatId });

    const queryClient = useQueryClient();

    const { data: { userId } } = useAuthStore();
    const chats: ChatList | undefined = queryClient.getQueryData(["chats"]);
    const { clientMethods } = useChatStore();
    const deleteChat = useDeleteChat(chatId);

    const currentChat = chats?.find(chat => chat.id === chatId);
    const { username: recipientName, id: recipientId } = currentChat?.members[0] || {};
    const { data: messages, isError, isLoading, isSuccess } = useGetMessagesByChatId(chatId);
    const { sendChatMessage, deleteChatMessage, setMessageSeen, isClientConnected } = clientMethods;

    const [inputData, setInputData] = useState({
        chatId: chatId,
        senderId: userId,
        recipientId,
        text: ''
    });

    const sendMessage = () => sendChatMessage(inputData);

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
        chatId,
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
        isEnabled
    };
}