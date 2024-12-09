import { CreateChatRequest } from "@/api/schemas/inferred/chat";
import { ResId } from "@/api/schemas/inferred/common";
import { useCreateChat, useDeleteChat, useGetChats, useGetMessagesByChatId } from "@/services/data/useChatData";
import { useAuthStore, useChatStore } from "@/services/store/zustand";
import { ChangeEvent, useState } from "react";

export const useChat = (chatId: ResId) => {

    const { data: { userId: senderId } } = useAuthStore();
    const { clientMethods } = useChatStore();
    const { sendChatMessage, isClientConnected } = clientMethods;

    const chats = useGetChats();
    const currentChat = chats.data?.find(chat => chat.id === chatId);
    if (currentChat === undefined) throw new Error("currentChat is undefined");
    const { username: recipientName, id: recipientId } = currentChat.members.find(member => member.id !== senderId) || {};

    const {
        data: messages,
        isError,
        isLoading,
        isSuccess,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage
    } = useGetMessagesByChatId(chatId);

    const messageList = messages;
    const messageCount = messages?.length;

    const [text, setText] = useState('');
    const formBody = { chatId, senderId, recipientId, text };
    const handleInputChange = (eventData: string) => {
        setText(eventData);
    };

    const createChatMutation = useCreateChat();
    const handleChatCreation = (recipientId: ResId, text: string, isGroupChat: boolean) => {
        const createChatRequestBody: CreateChatRequest = { isGroupChat, recipientId, text, "userIds": [senderId, recipientId] };
        createChatMutation.mutate(createChatRequestBody);
    };

    const createChat = () => {
        if (recipientId === undefined) throw new Error("recipientId is undefined");
        handleChatCreation(recipientId, text, false);
    };

    const handeSendMessgae = () => {
        if (chatId === "-1") createChat();
        sendChatMessage(formBody);
    };

    const deleteChat = useDeleteChat(chatId);
    const handleDeleteChat = (event: ChangeEvent) => {
        event.preventDefault();
        deleteChat.mutate();
    };

    const isInputEnabled: boolean = isSuccess && !!isClientConnected;


    return {
        text,
        chats,
        recipientName,
        recipientId,
        signedUserId: senderId,
        messages,
        messageList,
        messageCount,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        isError,
        isLoading,
        isInputEnabled,
        handeSendMessgae,
        handleInputChange,
        handleDeleteChat,
    };
}