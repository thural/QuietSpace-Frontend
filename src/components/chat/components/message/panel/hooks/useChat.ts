import { CreateChat } from "@/api/schemas/inferred/chat";
import { ResId } from "@/api/schemas/inferred/common";
import { useCreateChat, useDeleteChat, useGetChats, useGetMessagesByChatId } from "@/services/data/useChatData";
import { useAuthStore, useChatStore } from "@/services/store/zustand";
import { nullishValidationdError } from "@/utils/errorUtils";
import { ChangeEvent, useState } from "react";

export const useChat = (chatId: ResId) => {

    const { data: { userId: senderId } } = useAuthStore();
    const { clientMethods } = useChatStore();
    const { sendChatMessage, isClientConnected } = clientMethods;

    const chats = useGetChats();
    const currentChat = chats.data?.find(chat => chat.id === chatId);
    if (currentChat === undefined) throw nullishValidationdError({ currentChat });
    const { username: recipientName, id: recipientId } = currentChat.members.find(member => member.id !== senderId) || {};

    const deleteChat = useDeleteChat(chatId);
    const createChatMutation = useCreateChat();
    const { data: messages, isError, isLoading, isSuccess } = useGetMessagesByChatId(chatId);
    const isInputEnabled: boolean = isSuccess && !!isClientConnected;

    const [text, setText] = useState('');
    const formBody = { chatId, senderId, recipientId, text };



    const handleChatCreation = (recipientId: ResId, text: string, isGroupChat: boolean) => {
        const createChatRequestBody: CreateChat = { isGroupChat, recipientId, text, "userIds": [senderId, recipientId] };
        createChatMutation.mutate(createChatRequestBody);
    };

    const createChat = () => {
        if (recipientId === undefined) throw nullishValidationdError({ recipientId });
        handleChatCreation(recipientId, text, false);
    };

    const handeSendMessgae = () => {
        if (chatId === "-1") createChat();
        sendChatMessage(formBody);
    };

    const handleInputChange = (eventData: string) => {
        setText(eventData);
    };

    const handleDeleteChat = (event: ChangeEvent) => {
        event.preventDefault();
        deleteChat.mutate();
    };



    return {
        text,
        chats,
        recipientName,
        signedUserId: senderId,
        messages,
        isError,
        isLoading,
        isInputEnabled,
        handeSendMessgae,
        handleInputChange,
        handleDeleteChat,
    };
}