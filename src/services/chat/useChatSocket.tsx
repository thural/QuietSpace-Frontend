import {
    handleChatException,
    handleLeftChat,
    handleOnlineUser,
} from "../../components/chat/container/utils/chatHandler.js";

import chatQueries from "@/api/queries/chatQueries.js";
import { getSignedUser } from "@/api/queries/userQueries.js";
import { ChatEvent, Message, MessageBody } from "@/api/schemas/inferred/chat.js";
import { ResId } from "@/api/schemas/inferred/common.js";
import { StompMessage } from "@/api/schemas/inferred/websocket.js";
import { ChatEventType } from "@/api/schemas/native/chat.js";
import { ChatEventSchema, MessageSchema } from "@/api/schemas/zod/chatZod.js";
import { useEffect } from "react";
import { useChatStore, useStompStore } from "../store/zustand.js";
import { fromZodError } from 'zod-validation-error'
import { ZodError } from "zod";



const useChatSocket = () => {

    const user = getSignedUser()
    const { setClientMethods } = useChatStore();
    const { deleteMessageCache, insertMessageCache, setMessageSeenCache } = chatQueries();
    const { clientContext: { subscribe, sendMessage, isClientConnected } } = useStompStore();



    const onSubscribe = (message: StompMessage) => {
        const messageBody: Message | ChatEvent = JSON.parse(message.body);

        if (MessageSchema.safeParse(messageBody).success) {
            console.log("received chat message on websocket", messageBody);
            return insertMessageCache(messageBody as Message);
        }

        try {
            const chatEvent: ChatEvent = ChatEventSchema.parse(messageBody);
            const eventType = chatEvent.type;

            switch (eventType) {
                case ChatEventType.CONNECT:
                    return handleOnlineUser(chatEvent);
                case ChatEventType.DISCONNECT:
                    return handleOnlineUser(chatEvent);
                case ChatEventType.DELETE_MESSAGE:
                    return deleteMessageCache(chatEvent);
                case ChatEventType.SEEN_MESSAGE:
                    return setMessageSeenCache(chatEvent);
                case ChatEventType.LEFT_CHAT:
                    return handleLeftChat(chatEvent);
                case ChatEventType.EXCEPTION:
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