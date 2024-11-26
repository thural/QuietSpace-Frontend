import chatHandler from "./chatHandler.js";

import { getSignedUser } from "@/api/queries/userQueries.js";
import { ChatEvent, Message, MessageBody } from "@/api/schemas/inferred/chat.js";
import { ResId } from "@/api/schemas/inferred/common.js";
import { StompMessage } from "@/api/schemas/inferred/websocket.js";
import { SocketEventType } from "@/api/schemas/native/websocket.js";
import { ChatEventSchema, MessageSchema } from "@/api/schemas/zod/chatZod.js";
import { useEffect } from "react";
import { ZodError } from "zod";
import { fromZodError } from 'zod-validation-error';
import { useChatStore, useStompStore } from "@/services/store/zustand.js";



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

    const { clientContext: { subscribe, sendMessage, isClientConnected } } = useStompStore();


    const onSubscribe = (message: StompMessage) => {
        const messageBody: Message | ChatEvent = JSON.parse(message.body);

        if (MessageSchema.safeParse(messageBody).success)
            return hadnleRecievedMessage(messageBody as Message);

        try {
            const chatEvent: ChatEvent = ChatEventSchema.parse(messageBody);
            const eventType = chatEvent.type;

            switch (eventType) {
                case SocketEventType.CONNECT:
                    return handleOnlineUser(chatEvent);
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
                default: throw new Error("(!) ChatEventType value is unknown");
            }
        } catch (error: unknown) {
            if (error instanceof ZodError) console.error(fromZodError(error).message)
            else console.error("caught error on processing chat event: ", (error as Error).message);
        }
    }


    const sendChatMessage = (inputData: MessageBody) => sendMessage("/app/private/chat", inputData);
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