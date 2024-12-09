import chatHandler from "./chatHandler.js";

import { getSignedUser } from "@/api/queries/userQueries.js";
import { ChatEvent, MessageRequest, MessageResponse } from "@/api/schemas/inferred/chat.js";
import { ResId } from "@/api/schemas/inferred/common.js";
import { StompMessage } from "@/api/schemas/inferred/websocket.js";
import { SocketEventType } from "@/api/schemas/native/websocket.js";
import { ChatEventSchema, MessageResponseSchema } from "@/api/schemas/zod/chatZod.js";
import { useChatStore, useStompStore } from "@/services/store/zustand.js";
import { useEffect } from "react";
import { ZodError } from "zod";
import { fromZodError } from 'zod-validation-error';



const useChatSocket = () => {
    const user = getSignedUser();
    const { setClientMethods } = useChatStore();

    const {
        hadnleRecievedMessage,
        handleChatException,
        handleLeftChat,
        handleOnlineUser,
        handleDeleteMessage,
        handleSeenMessage
    } = chatHandler();

    const { clientContext } = useStompStore();
    const { subscribe, sendMessage, isClientConnected } = clientContext;

    const onSubscribe = (message: StompMessage) => {
        const messageBody: MessageResponse | ChatEvent = JSON.parse(message.body);

        if (MessageResponseSchema.safeParse(messageBody).success)
            return hadnleRecievedMessage(messageBody as MessageResponse);

        try {
            const chatEvent: ChatEvent = ChatEventSchema.parse(messageBody);
            const eventType = chatEvent.type;

            switch (eventType) {
                case SocketEventType.CONNECT:
                case SocketEventType.DISCONNECT:
                    return handleOnlineUser(chatEvent);
                case SocketEventType.DELETE_MESSAGE:
                    return handleDeleteMessage(chatEvent);
                case SocketEventType.SEEN_MESSAGE:
                    return handleSeenMessage(chatEvent);
                case SocketEventType.LEFT_CHAT:
                    return handleLeftChat(chatEvent);
                case SocketEventType.EXCEPTION:
                    return handleChatException(chatEvent);
                default:
                    throw new Error("(!) ChatEventType value is unknown");
            }
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                console.error(fromZodError(error).message);
            } else {
                console.error("Caught error on processing chat event: ", (error as Error).message);
            }
        }
    };

    const sendChatMessage = (inputData: MessageRequest) => {
        if (sendMessage) sendMessage("/app/private/chat", inputData);
        else throw new Error("sendMessage is undefined");;
    };

    const deleteChatMessage = (messageId: ResId) => {
        if (sendMessage) sendMessage(`/app/private/chat/delete/${messageId}`);
        else throw new Error("sendMessage is undefined");;
    };

    const setMessageSeen = (messageId: ResId) => {
        if (sendMessage) sendMessage(`/app/private/chat/seen/${messageId}`);
        else throw new Error("sendMessage is undefined");;
    };

    const clientMethods = { sendChatMessage, deleteChatMessage, setMessageSeen, isClientConnected };

    const setup = () => {
        if (!isClientConnected || !user || !subscribe) return;
        subscribe(`/user/${user.id}/private/chat/event`, onSubscribe);
        subscribe(`/user/${user.id}/private/chat`, onSubscribe);
        setClientMethods(clientMethods);
    };

    useEffect(setup, [subscribe, sendMessage, isClientConnected, user]);
    return clientMethods;
};

export default useChatSocket;