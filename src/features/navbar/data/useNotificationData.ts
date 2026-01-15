import chatQueries from "@/api/queries/chatQueries";
import useUserQueries from "@/api/queries/userQueries";
import { useGetNotifications } from "@/services/data/useNotificationData";
import { useMemo } from "react";
import { createNotificationStatus, hasUnreadMessages, hasPendingNotifications, NotificationStatusEntity } from "../domain";

/**
 * Data layer hook for managing notification and chat data.
 * 
 * This hook handles all external data fetching and transformation,
 * mapping raw API responses to domain entities.
 * 
 * @returns {{
 *   notificationData: NotificationStatusEntity,
 *   error: Error | null
 * }} - Transformed notification data and any errors
 */
export const useNotificationData = () => {
  const { getChatsCache } = chatQueries();
  const chats = getChatsCache();
  const { getSignedUserElseThrow } = useUserQueries();
  const user = getSignedUserElseThrow();
  const { data, isLoading, error } = useGetNotifications();

  /**
   * Flattens paginated notification data into a single array.
   */
  const flattenedNotifications = useMemo(() => {
    return !!data ? data.pages.flatMap((page) => page.content) : [];
  }, [data]);

  /**
   * Calculates unread chat status using domain logic.
   */
  const hasUnreadChat = useMemo(() => {
    return hasUnreadMessages(chats, String(user.id));
  }, [chats, user.id]);

  /**
   * Calculates pending notification status using domain logic.
   */
  const hasPendingNotification = useMemo(() => {
    return hasPendingNotifications(flattenedNotifications);
  }, [flattenedNotifications]);

  /**
   * Creates notification status entity using domain factory function.
   */
  const notificationData: NotificationStatusEntity = useMemo(() => {
    return createNotificationStatus(hasPendingNotification, hasUnreadChat, isLoading);
  }, [hasPendingNotification, hasUnreadChat, isLoading]);

  return {
    notificationData,
    error
  };
};
