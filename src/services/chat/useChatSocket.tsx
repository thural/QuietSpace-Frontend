import {
    handleChatDelete,
    handleChatException,
    handleLeftChat,
    handleOnlineUser,
} from "../../components/chat/container/utils/chatHandler.js";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useChatStore, useStompStore } from "../store/zustand.js";
import { MessageBody } from "@/api/schemas/inferred/chat.js";
import { User } from "@/api/schemas/inferred/user.js";
import { nullishValidationdError } from "@/utils/errorUtils.js";
import { ResId } from "@/api/schemas/inferred/common.js";
import { ChatEventSchema, MessageSchema } from "@/api/schemas/zod/chatZod.js";
import { StompMessage } from "@/api/schemas/inferred/websocket.js";
import { ChatEventType } from "@/api/schemas/native/chat.js";
import chatQueries from "@/api/queries/chatQueries.js";



const useChatSocket = (chatId: ResId | null = null) => {

    const queryClient = useQueryClient();
    const user: User | undefined = queryClient.getQueryData(["user"]);
    if (user === undefined) throw nullishValidationdError({ user });
    const { handleReceivedMessage, handleDeletedMessage, handleSeenMessage } = chatQueries();
    const { setClientMethods } = useChatStore();
    const { clientContext: { subscribe, sendMessage, isClientConnected } } = useStompStore();



    const onSubscribe = (message: StompMessage) => {
        const messageBody: any = JSON.parse(message.body);

        if (MessageSchema.safeParse(messageBody).success) return handleReceivedMessage(messageBody);

        try {
            if (!ChatEventSchema.safeParse(messageBody).success) return;
            const eventType = ChatEventSchema.parse(messageBody).type;

            switch (eventType) {
                case ChatEventType.CONNECT:
                    return handleOnlineUser(messageBody);
                case ChatEventType.DISCONNECT:
                    return handleOnlineUser(messageBody);
                case ChatEventType.DELETE_MESSAGE:
                    return handleChatDelete(messageBody);
                case ChatEventType.DELETE_MESSAGE:
                    return handleDeletedMessage(messageBody);
                case ChatEventType.SEEN_MESSAGE:
                    return handleSeenMessage(messageBody);
                case ChatEventType.LEFT_CHAT:
                    return handleLeftChat(messageBody);
                case ChatEventType.EXCEPTION:
                    return handleChatException(messageBody);
                default: throw new Error("(!) ChatEventType value is unknown")
            }
        } catch (error: unknown) {
            console.error("caught error on processing chat event: ", (error as Error).message);
        }
    }

    const sendChatMessage = (inputData: MessageBody) => {
        if (chatId === null) throw nullishValidationdError({ inputData });
        inputData.chatId = chatId;
        sendMessage("/app/private/chat", inputData);
    }

    const deleteChatMessage = (messageId: ResId) => sendMessage(`/app/private/chat/delete/${messageId}`);
    const setMessageSeen = (messageId: ResId) => sendMessage(`/app/private/chat/seen/${messageId}`);

    const clientMethods = { sendChatMessage, deleteChatMessage, setMessageSeen, isClientConnected }

    const setup = () => {
        if (!isClientConnected || !user) return;
        subscribe(`/user/${user.id}/private/chat/event`, onSubscribe);
        subscribe(`/user/${user.id}/private/chat`, onSubscribe);
        setClientMethods(clientMethods);
    }



    useEffect(setup, [isClientConnected, user]);
    return clientMethods;
}

export default useChatSocket