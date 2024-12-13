import useUserQueries from "@/api/queries/userQueries";
import { MessageResponse } from "@/api/schemas/inferred/chat";
import useWasSeen from "@/services/hook/common/useWasSeen";
import { useChatStore } from "@/services/store/zustand";
import { useCallback, useEffect } from "react";
import useHoverState from "../shared/useHoverState";

/**
 * Custom hook to manage message functionality.
 * 
 * @param {MessageResponse} message - The message object to manage.
 * @returns {Object} - An object containing message-related data and methods.
 * @returns {Object} user - The user object of the signed-in user.
 * @returns {boolean} isHovering - Indicates if the message is being hovered over.
 * @returns {Object} wasSeenRef - Reference to track if the message was seen.
 * @returns {function} handleMouseOver - Function to handle mouse over events.
 * @returns {function} handleMouseOut - Function to handle mouse out events.
 * @returns {function} handleDeleteMessage - Function to handle deleting the message.
 */

export const useMessage = (message: MessageResponse) => {
    const { getSignedUserElseThrow } = useUserQueries();
    const user = getSignedUserElseThrow();
    const [wasSeen, wasSeenRef] = useWasSeen();
    const { clientMethods } = useChatStore();
    const { deleteChatMessage, setMessageSeen, isClientConnected } = clientMethods;

    const {
        isHovering,
        handleMouseOver,
        handleMouseOut
    } = useHoverState();

    /**
     * Marks the message as seen if applicable.
     * Logs an error if the client is not connected.
     */
    const handleSeenMessage = useCallback(() => {
        if (!isClientConnected) {
            console.error("stomp client is not connected yet");
            return;
        }

        if (
            message.senderId === user.id ||
            message.isSeen ||
            !wasSeen
        ) return;

        setMessageSeen(message.id);
    }, [
        isClientConnected,
        message.senderId,
        message.id,
        message.isSeen,
        user.id,
        wasSeen,
        setMessageSeen
    ]);

    /**
     * Deletes the message.
     */
    const handleDeleteMessage = useCallback(() => {
        deleteChatMessage(message.id);
    }, [deleteChatMessage, message.id]);

    useEffect(() => {
        handleSeenMessage();
    }, [wasSeen, isClientConnected, handleSeenMessage]);

    return {
        user,
        isHovering,
        wasSeenRef,
        handleMouseOver,
        handleMouseOut,
        handleDeleteMessage,
    };
};

export default useMessage;