import {
    handleChatDelete,
    handleChatException,
    handleLeftChat,
    handleOnlineUser,
} from "../../components/chat/container/utils/chatHandler.js";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useChatStore, useStompStore } from "../store/zustand.js";
import { ChatEvent, ChatList, MessageBody, Message, PagedMessage } from "@/api/schemas/inferred/chat.js";
import { User } from "@/api/schemas/inferred/user.js";
import { nullishValidationdError } from "@/utils/errorUtils.js";
import { ResId } from "@/api/schemas/inferred/common.js";
import { ChatEventSchema, MessageSchema } from "@/api/schemas/zod/chatZod.js";
import { StompMessage } from "@/api/schemas/inferred/websocket.js";
import { ChatEventType } from "@/api/schemas/native/chat.js";



const useChatSocket = () => {

    const queryClient = useQueryClient();
    const user: User | undefined = queryClient.getQueryData(["user"]);
    if (user === undefined) throw nullishValidationdError({ user });
    const { data: { activeChatId }, setClientMethods } = useChatStore();
    const { clientContext: { subscribe, sendMessage, isClientConnected } } = useStompStore();


    const updateChatData = (message: Message) => {
        queryClient.setQueryData(['chats'], (oldData: ChatList) => {
            const updatedChats = oldData.map(chat => {
                if (chat.id !== message.chatId) return chat;
                chat.recentMessage = message;
                return chat;
            });
            return updatedChats;
        });
    }

    const handleReceivedMessage = (messageBody: Message) => {
        queryClient.setQueryData(['messages', { id: activeChatId }], (oldData: PagedMessage) => {
            return { ...oldData, content: [messageBody, ...oldData.content] };
        });

        queryClient.invalidateQueries({ queryKey: ["chats"] });
    }

    const handleDeletedMessage = (messageBody: ChatEvent) => {
        queryClient.setQueryData(['messages', { id: activeChatId }], (oldData: PagedMessage) => {
            const updatedMessages = oldData.content.filter(message => message.id !== messageBody.messageId);
            return { ...oldData, content: updatedMessages };
        });

        queryClient.invalidateQueries({ queryKey: ["chats"] });
    }

    const handleSeenMessage = ({ messageId, chatId }: { messageId: ResId, chatId: ResId }) => {
        queryClient.setQueryData(['messages', { id: chatId }], (oldData: PagedMessage) => {
            const updatedMessages = oldData.content.map(message => {
                if (message.id !== messageId) return message;
                message.isSeen = true;
                return message;
            });
            return { ...oldData, content: updatedMessages };
        });

        queryClient.invalidateQueries({ queryKey: ["chats"] });
    }

    const onSubscribe = (message: StompMessage) => {

        const messageBody: any = JSON.parse(message.body);
        if (MessageSchema.safeParse(messageBody).success) return handleReceivedMessage(messageBody);

        try {
            const eventType = ChatEventSchema.parse(messageBody).type;

            switch (eventType) {
                case ChatEventType.CONNECT:
                    return handleOnlineUser(message);
                case ChatEventType.DISCONNECT:
                    return handleOnlineUser(message);
                case ChatEventType.DELETE_MESSAGE:
                    return handleChatDelete(message);
                case ChatEventType.DELETE_MESSAGE:
                    return handleDeletedMessage(messageBody);
                case ChatEventType.SEEN_MESSAGE:
                    return handleSeenMessage(messageBody);
                case ChatEventType.LEFT_CHAT:
                    return handleLeftChat(message);
                case ChatEventType.EXCEPTION:
                    return handleChatException(message);
                default: throw new Error("(!) ChatEventType value is unknown")
            }
        } catch (error: unknown) {
            console.error("caught error on processing chat event: ", (error as Error).message)
        }
    }



    const sendChatMessage = (inputData: MessageBody) => {
        if (activeChatId === null) throw nullishValidationdError({ inputData });
        inputData.chatId = activeChatId;
        sendMessage("/app/private/chat", inputData);
    }

    const deleteChatMessage = (messageId: ResId) => sendMessage(`/app/private/chat/delete/${messageId}`);
    const setMessageSeen = (messageId: ResId) => sendMessage(`/app/private/chat/seen/${messageId}`);

    const clientMethods = { sendChatMessage, deleteChatMessage, setMessageSeen, isClientConnected }

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