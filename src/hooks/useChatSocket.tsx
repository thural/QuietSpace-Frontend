import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { ChatEventType } from "../utils/enumClasses.js";

import {
    handleChatDelete,
    handleChatException,
    handleLeftChat,
    handleOnlineUser,
} from "../components/chat/container/utils/chatHandler.js";

import { useChatStore, useStompStore } from "./zustand.js";

const useChatSocket = () => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const { data: { activeChatId }, setClientMethods } = useChatStore();
    const { clientContext: { subscribe, sendMessage, isClientConnected } } = useStompStore();



    const updateChatData = (message) => {
        queryClient.setQueryData(['chats'], (oldData) => {
            const updatedChats = oldData.map(chat => {
                if (chat.id !== message.chatId) return chat;
                chat.lastMessgae = message;
                return chat;
            });
            return updatedChats;
        });
    }

    const handleReceivedMessage = (messageBody) => {
        queryClient.setQueryData(['messages', { id: activeChatId }], (oldData) => {
            return { ...oldData, content: [messageBody, ...oldData.content] };;
        });

        queryClient.invalidateQueries(["chats"]);
    }

    const handleDeletedMessage = (messageBody) => {
        queryClient.setQueryData(['messages', { id: activeChatId }], (oldData) => {
            const updatedMessages = oldData.content.filter(m => m.id !== messageBody.messageId);
            return { ...oldData, content: updatedMessages };
        });

        queryClient.invalidateQueries(["chats"]);
    }

    const handleSeenMessage = ({ messageId, chatId }) => {
        queryClient.setQueryData(['messages', { id: chatId }], (oldData) => {
            const updatedMessages = oldData.content.map(m => {
                if (m.id !== messageId) return m;
                m.isSeen = true;
                return m;
            });
            return { ...oldData, content: updatedMessages };
        });

        queryClient.invalidateQueries(["chats"]);
    }

    const onSubscribe = (message) => {
        const messageBody = JSON.parse(message.body);

        switch (messageBody.type) {
            case ChatEventType.CONNECT.name:
                return handleOnlineUser(message);
            case ChatEventType.DISCONNECT.name:
                return handleOnlineUser(message);
            case ChatEventType.DELETE.name:
                return handleChatDelete(message);
            case ChatEventType.DELETE_MESSAGE.name:
                return handleDeletedMessage(messageBody);
            case ChatEventType.SEEN_MESSAGE.name:
                return handleSeenMessage(messageBody);
            case ChatEventType.LEFT_CHAT.name:
                return handleLeftChat(message);
            case ChatEventType.EXCEPTION.name:
                return handleChatException(message);
            default:
                return handleReceivedMessage(messageBody);
        }
    }

    const sendChatMessage = (inputData) => {
        if (inputData.text.length === 0) return;
        inputData.chatId = activeChatId;
        sendMessage("/app/private/chat", inputData);
    }

    const deleteChatMessage = (messageId) => {
        sendMessage(`/app/private/chat/delete/${messageId}`);
    }

    const setMessageSeen = (messageId) => {
        sendMessage(`/app/private/chat/seen/${messageId}`);
    }

    const clientMethods = {
        sendChatMessage,
        deleteChatMessage,
        setMessageSeen,
        isClientConnected
    }

    const setup = () => {
        if (!isClientConnected || !user) return
        subscribe(`/user/${user.id}/private/chat/event`, onSubscribe);
        subscribe(`/user/${user.id}/private/chat`, onSubscribe);
        setClientMethods(clientMethods);
    }

    useEffect(setup, [isClientConnected, user]);



    return clientMethods;
}

export default useChatSocket