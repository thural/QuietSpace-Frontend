import notificationQueries from "@/core/network/api/queries/notificationQueries";
import useUserQueries from "@/core/network/api/queries/userQueries";
import { NotificationResponse, NotificationEvent } from "@/features/notification/data/models/notification";
import { ResId } from "@/shared/api/models/commonNative";
import { NotificationEventSchema } from "@/api/rest/models/zod/notificationZod";
import { useNotificationStore, useStompStore } from "@/core/store/zustand";
import { useEffect } from "react";
import { Frame } from "stompjs";

/**
 * Custom hook for managing WebSocket connections for notifications.
 *
 * This hook establishes a WebSocket connection to receive real-time notifications
 * and handles the marking of notifications as seen. It utilizes Zustand for state management
 * and Stomp.js for handling WebSocket frames.
 *
 * @returns {{
 *     setNotificationSeen: (notificationId: ResId) => void, // Function to mark a notification as seen.
 *     isClientConnected: boolean                             // Indicates if the WebSocket client is connected.
 * }} - An object containing methods for managing notifications via WebSocket.
 */
const useNotificationSocket = () => {
    const { getSignedUser } = useUserQueries();
    const user = getSignedUser();
    const { setClientMethods } = useNotificationStore();
    const { handleReceivedNotifcation, handleSeenNotification } = notificationQueries();
    const { clientContext } = useStompStore();
    const { subscribe, sendMessage, isClientConnected } = clientContext;

    /**
     * Handles incoming subscription messages for notifications.
     *
     * @param {Frame} message - The Stomp.js frame containing the notification message.
     */
    const onSubscribe = (message: Frame) => {
        const messageBody: NotificationResponse | NotificationEvent = JSON.parse(message.body);
        if (NotificationEventSchema.safeParse(messageBody).success) {
            handleSeenNotification(messageBody as NotificationEvent);
        } else {
            handleReceivedNotifcation(messageBody as NotificationResponse);
        }
    }

    /**
     * Sends a message to mark a specific notification as seen.
     *
     * @param {ResId} notificationId - The ID of the notification to mark as seen.
     */
    const setNotificationSeen = (notificationId: ResId) => {
        if (sendMessage) sendMessage(`/app/private/notifications/seen/${notificationId}`);
    }

    const clientMethods = { setNotificationSeen, isClientConnected };

    /**
     * Sets up the subscription to notification channels when the client is connected.
     */
    const setup = () => {
        if (!isClientConnected || !user || !subscribe) return;
        subscribe(`/user/${user.id}/private/notifications`, onSubscribe);
        subscribe(`/user/${user.id}/private/notifications/event`, onSubscribe);
        setClientMethods(clientMethods);
    }

    useEffect(setup, [isClientConnected, user]);

    return clientMethods;
}

export default useNotificationSocket;