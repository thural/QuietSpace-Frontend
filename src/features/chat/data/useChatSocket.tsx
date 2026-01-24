import chatHandler from "@features/chat/application/hooks/chatHandler";
import useUserQueries from "@/features/profile/data/userQueries";
import { ChatEvent, MessageRequest, MessageResponse } from "./models/chat";
import { ResId } from "@/shared/api/models/common";
import { StompMessage } from "@/shared/api/models/websocket";
import { SocketEventType } from "@/shared/api/models/websocketNative";
import { ChatEventSchema, MessageResponseSchema } from "./models/chatZod";
import { useChatStore, useStompStore } from "@/core/store/zustand";
import { useEffect } from "react";
import { ZodError } from "zod";
import { fromZodError } from 'zod-validation-error';

/**
 * Custom hook for managing chat socket interactions.
 *
 * This hook sets up the WebSocket connection for chat functionality, 
 * handles incoming messages and events, and provides methods to send 
 * and manipulate chat messages.
 */
type UseChatSocketReturn = {
    sendChatMessage: (inputData: MessageRequest) => void; // Function to send a chat message.
    deleteChatMessage: (messageId: ResId) => void;        // Function to delete a chat message.
    setMessageSeen: (messageId: ResId) => void;           // Function to mark a message as seen.
    isClientConnected: boolean;                               // Indicates if the WebSocket client is connected.
};

const useChatSocket = (): UseChatSocketReturn => {
    const { getSignedUser } = useUserQueries();
    const user = getSignedUser();
    const { setClientMethods } = useChatStore();

    const {
        handleReceivedMessage,
        handleChatException,
        handleLeftChat,
        handleOnlineUser,
        handleDeleteMessage,
        handleSeenMessage
    } = chatHandler();

    const { clientContext } = useStompStore();
    const { subscribe, sendMessage, isClientConnected } = clientContext;

    /**
     * Handles incoming WebSocket messages.
     *
     * This function processes incoming messages from the chat server, 
     * distinguishing between message responses and chat events. It uses 
     * Zod schemas to validate the message structure and invokes the appropriate 
     * handler based on the event type.
     *
     * @param {StompMessage} message - The incoming WebSocket message.
     */
    const onSubscribe = (message: StompMessage) => {
        const messageBody: MessageResponse | ChatEvent = JSON.parse(message.body);

        if (MessageResponseSchema.safeParse(messageBody).success) {
            return handleReceivedMessage(messageBody as MessageResponse);
        }

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

    /**
     * Sends a chat message to the server.
     *
     * @param {MessageRequest} inputData - The message data to be sent.
     * @throws Will throw an error if sendMessage is undefined.
     */
    const sendChatMessage = (inputData: MessageRequest) => {
        if (sendMessage) {
            sendMessage("/app/private/chat", inputData);
        } else {
            throw new Error("sendMessage is undefined");
        }
    };

    /**
     * Deletes a chat message on the server.
     *
     * @param {ResId} messageId - The identifier of the message to be deleted.
     * @throws Will throw an error if sendMessage is undefined.
     */
    const deleteChatMessage = (messageId: ResId) => {
        if (sendMessage) {
            sendMessage(`/app/private/chat/delete/${messageId}`);
        } else {
            throw new Error("sendMessage is undefined");
        }
    };

    /**
     * Marks a chat message as seen on the server.
     *
     * @param {ResId} messageId - The identifier of the message to be marked as seen.
     * @throws Will throw an error if sendMessage is undefined.
     */
    const setMessageSeen = (messageId: ResId) => {
        if (sendMessage) {
            sendMessage(`/app/private/chat/seen/${messageId}`);
        } else {
            throw new Error("sendMessage is undefined");
        }
    };

    const clientMethods = { sendChatMessage, deleteChatMessage, setMessageSeen, isClientConnected };

    /**
     * Sets up the chat subscriptions and client methods.
     *
     * This function subscribes to the appropriate chat channels and 
     * provides client methods for sending and managing messages.
     */
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