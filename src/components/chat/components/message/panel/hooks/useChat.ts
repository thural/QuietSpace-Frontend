import { useCreateChat, useDeleteChat, useGetMessagesByChatId } from "@/services/data/useChatData";
import { useAuthStore, useChatStore } from "@/services/store/zustand";
import { ChangeEvent, useState } from "react";
import { ChatList, CreateChat } from "@/api/schemas/inferred/chat";
import { ResId } from "@/api/schemas/inferred/common";
import { nullishValidationdError } from "@/utils/errorUtils";
import chatQueries from "@/api/queries/chatQueries";

export const useChat = (chatId: ResId) => {

    const { data: { userId } } = useAuthStore();
    const { clientMethods } = useChatStore();
    const { sendChatMessage, isClientConnected } = clientMethods;

    const { getChatsCache } = chatQueries();
    const chats: ChatList | undefined = getChatsCache()
    const currentChat = chats?.find(chat => chat.id === chatId);
    if (currentChat === undefined) throw nullishValidationdError({ currentChat });
    const { username: recipientName, id: recipientId } = currentChat.members.find(member => member.id !== userId) || {};



    const deleteChat = useDeleteChat(chatId);
    const createChatMutation = useCreateChat();
    const { data: messages, isError, isLoading, isSuccess } = useGetMessagesByChatId(chatId);



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

    const handeSendMessgae = () => {
        if (chatId === "-1") createChat();
        sendChatMessage(inputData);
    };

    const handleInputChange = (eventData: string) => {
        setInputData({ ...inputData, text: eventData });
    }

    const handleDeleteChat = (event: ChangeEvent) => {
        event.preventDefault();
        deleteChat.mutate();
    }



    const isInputEnabled: boolean = isSuccess && !!isClientConnected;



    return {
        chats,
        recipientName,
        messages,
        isError,
        isLoading,
        handeSendMessgae,
        inputData,
        handleInputChange,
        handleDeleteChat,
        isInputEnabled,
    };
}