import { useState, useEffect, useCallback, useMemo } from "react";
import chatQueries from "@/api/queries/chatQueries";
import useUserQueries from "@/api/queries/userQueries";
import { useGetNotifications } from "@/services/data/useNotificationData";
import type { INotificationRepository } from "../../domain";
import { 
  NotificationStatusEntity, 
  createNotificationStatus, 
  hasUnreadMessages, 
  hasPendingNotifications 
} from "../../domain";
import { createNotificationRepository, type RepositoryConfig } from "../../data/repositories";
import { NotificationRepository } from "../../data/repositories";

/**
 * Legacy hook for backward compatibility - WORKING VERSION
 * 
 * @returns {{ notificationData: NotificationStatusEntity, error: Error | null }} - Legacy notification data
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

/**
 * Repository pattern hook for future use - NOT WORKING YET
 * 
 * @param {RepositoryConfig} config - Optional configuration for repository creation
 * @param {INotificationRepository} repository - Optional repository injection for testing
 * @returns {{
 *   notificationData: NotificationStatusEntity,
 *   error: Error | null,
 *   isLoading: boolean
 * }} - Notification status and loading/error states
 */
export const useNotificationDataWithRepository = (config?: RepositoryConfig, repository?: INotificationRepository) => {
  // Use injected repository or create one using factory
  const notificationRepository = repository || createNotificationRepository(config);
  
  const [notificationData, setNotificationData] = useState<NotificationStatusEntity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetches notification data from repository.
   */
  const fetchNotificationData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await notificationRepository.getNotificationStatus();
      setNotificationData(data);
    } catch (err) {
      setError(err as Error);
      setNotificationData(null);
    } finally {
      setIsLoading(false);
    }
  }, [notificationRepository]);

  // Fetch data on mount and when repository changes
  useEffect(() => {
    fetchNotificationData();
  }, [fetchNotificationData]);

  // Return data and loading/error states
  return {
    notificationData: notificationData || {
      hasPendingNotification: false,
      hasUnreadChat: false,
      isLoading: false
    },
    error,
    isLoading: isLoading || notificationRepository.isLoading()
  };
};

/**
 * Legacy hook for backward compatibility.
 * 
 * @deprecated Use useNotificationData with repository pattern instead
 * @returns {{ notificationData: NotificationStatusEntity, error: Error | null }} - Legacy notification data
 */
export const useNotificationDataLegacy = () => {
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
