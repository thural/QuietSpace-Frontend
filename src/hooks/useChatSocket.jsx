import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useStompClient } from "./useStompClient";
import { ChatEventType } from "../utils/enumClasses";

import {
    handleChatDelete,
    handleChatException,
    handleLeftChat,
    handleOnlineUser,
    handleSeenMessage
} from "../components/Chat/misc/messageHandler";

import { useChatStore } from "./zustand";

const useChatSocket = () => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const { data: { activeChatId } } = useChatStore();



    const handleReceivedMessage = (messageBody) => {
        queryClient.setQueryData(['messages', { id: activeChatId }], (oldData) => {
            return { ...oldData, content: [messageBody, ...oldData.content] };;
        });
    }

    const handleDeletedMessage = (messageBody) => {
        const messageId = messageBody.messageId;

        queryClient.setQueryData(['messages', { id: activeChatId }], (oldData) => {
            const updatedMessages = oldData.content.filter(m => m.id !== messageId);
            return { ...oldData, content: updatedMessages };
        });
    }



    const onSubscribe = (message) => {
        const messageBody = JSON.parse(message.body)

        const {
            EXCEPTION,
            CONNECT,
            DISCONNECT,
            DELETE,
            DELETE_MESSAGE,
            SEEN_MESSAGE,
            LEFT_CHAT
        } = ChatEventType;

        switch (messageBody.type) {
            case CONNECT.name:
                return handleOnlineUser(message);
            case DISCONNECT.name:
                return handleOnlineUser(message);
            case DELETE.name:
                return handleChatDelete(message);
            case DELETE_MESSAGE.name:
                return handleDeletedMessage(messageBody);
            case SEEN_MESSAGE.name:
                return handleSeenMessage(message);
            case LEFT_CHAT.name:
                return handleLeftChat(message);
            case EXCEPTION.name:
                return handleChatException(message);
            default:
                return handleReceivedMessage(messageBody);
        }
    }



    const {
        disconnect,
        subscribe,
        sendMessage,
        setAutoReconnect,
        isClientConnected,
        isConnecting,
        isDisconnected,
        isError,
        error
    } = useStompClient({ onSubscribe });


    useEffect(() => {
        if (isClientConnected) {
            subscribe(`/user/${user.id}/private/chat/event`);
            subscribe(`/user/${user.id}/private/chat`);
        }
    }, [isClientConnected]);



    const sendChatMessage = (inputData) => {
        if (inputData.text.length === 0) return;
        inputData.chatId = activeChatId;
        sendMessage("/app/private/chat", inputData);
    }

    const deleteChatMessage = (messageId) => {
        sendMessage(`/app/private/chat/delete/${messageId}`);
    }



    return {
        sendChatMessage,
        deleteChatMessage
    }

}

export default useChatSocket