import chatQueries from "@/api/queries/chatQueries";
import useUserQueries from "@/api/queries/userQueries";
import { NotificationResponse } from "@/api/schemas/inferred/notification";
import { useGetNotifications } from "@/services/data/useNotificationData";
import { useMemo } from "react";

/**
 * Custom hook for managing and retrieving notification state and chat status.
 *
 * This hook retrieves the signed-in user, checks for unread chats,
 * and manages the loading state of notifications. It also provides
 * functionalities to assess pending notifications and unread messages.
 *
 * @returns {{
 *     hasPendingNotification: boolean,               // Indicates if there are any unread notifications.
 *     hasUnreadChat: boolean,                         // Indicates if there are any unread chat messages.
 *     isLoading: boolean                              // Indicates if the notifications are currently being loaded.
 * }} - An object containing notification status and loading state.
 */
const useNotification = () => {
    const { getChatsCache } = chatQueries();
    const chats = getChatsCache();
    const { getSignedUserElseThrow } = useUserQueries();
    const user = getSignedUserElseThrow();
    const { data, isLoading } = useGetNotifications();

    /**
     * Flattens the pages of notifications into a single array.
     *
     * @returns {Array<NotificationResponse>} - The flattened array of notification responses.
     */
    const flatPages = () => !!data ? data.pages.flatMap((page) => page.content) : [];
    const content: Array<NotificationResponse> = useMemo(flatPages, [isLoading]);

    /**
     * Checks if there are any unread chat messages.
     *
     * @returns {boolean} - True if there are unread messages; otherwise, false.
     */
    const hasUnreadChat = useMemo(() => {
        if (!chats) return false;
        return chats.some(({ recentMessage }) => {
            return !recentMessage?.isSeen && recentMessage?.senderId !== user.id;
        });
    }, [chats]);

    /**
     * Checks if there are any pending notifications that have not been seen.
     *
     * @returns {boolean} - True if there are pending notifications; otherwise, false.
     */
    const hasPendingNotification = useMemo(() => {
        if (content === undefined) return false;
        return content.some(({ isSeen }) => !isSeen);
    }, [isLoading]);

    return { hasPendingNotification, hasUnreadChat, isLoading };
}

export default useNotification;