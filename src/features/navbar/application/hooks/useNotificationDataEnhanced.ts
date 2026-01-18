/**
 * Enhanced useNotificationData hook with proper React Query integration.
 * 
 * This hook combines the power of React Query with the clean architecture
 * of the Repository Pattern, providing the best of both worlds.
 */

import { useMemo } from "react";
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
import { ReactiveNotificationRepository, createReactiveNotificationRepository } from "../../data/repositories";

/**
 * Enhanced hook that combines React Query with Repository Pattern.
 * 
 * This approach maintains React Query's reactivity while leveraging the Repository Pattern
 * for clean architecture and testability.
 * 
 * @param {RepositoryConfig} config - Optional configuration for repository creation
 * @param {INotificationRepository} repository - Optional repository injection for testing
 * @returns {{
 *   notificationData: NotificationStatusEntity,
 *   error: Error | null,
 *   isLoading: boolean,
 *   repository: INotificationRepository
 * }} - Enhanced notification data with repository access
 */
export const useNotificationDataEnhanced = (
  config?: RepositoryConfig, 
  repository?: INotificationRepository
) => {
  // Get React Query data (maintains reactivity)
  const { getChatsCache } = chatQueries();
  const chats = getChatsCache();
  const { getSignedUserElseThrow } = useUserQueries();
  const user = getSignedUserElseThrow();
  const { data, isLoading, error } = useGetNotifications();

  // Create reactive repository
  const reactiveRepository = useMemo(() => {
    const baseRepository = repository || createNotificationRepository(config);
    const reactiveRepo = new ReactiveNotificationRepository(baseRepository);
    
    // Update repository with React Query data
    reactiveRepo.updateExternalData({
      chats,
      notifications: !!data ? data.pages.flatMap((page) => page.content) : [],
      user,
      isLoading,
      error
    });
    
    return reactiveRepo;
  }, [repository, config, chats, data, user, isLoading, error]);

  // Calculate notification status using domain logic (maintains performance)
  const flattenedNotifications = useMemo(() => {
    return !!data ? data.pages.flatMap((page) => page.content) : [];
  }, [data]);

  const hasUnreadChat = useMemo(() => {
    return hasUnreadMessages(chats, String(user.id));
  }, [chats, user.id]);

  const hasPendingNotification = useMemo(() => {
    return hasPendingNotifications(flattenedNotifications);
  }, [flattenedNotifications]);

  const notificationData: NotificationStatusEntity = useMemo(() => {
    return createNotificationStatus(hasPendingNotification, hasUnreadChat, isLoading);
  }, [hasPendingNotification, hasUnreadChat, isLoading]);

  return {
    notificationData,
    error,
    isLoading,
    repository: reactiveRepository
  };
};

/**
 * Simple hook that uses the repository pattern with React Query data.
 * 
 * This is a cleaner implementation that focuses on the core functionality
 * while maintaining proper React reactivity.
 * 
 * @param {RepositoryConfig} config - Optional repository configuration
 * @returns {{
 *   notificationData: NotificationStatusEntity,
 *   error: Error | null,
 *   isLoading: boolean
 * }} - Notification data with repository benefits
 */
export const useNotificationDataWithRepo = (config?: RepositoryConfig) => {
  // Get React Query data (maintains reactivity)
  const { getChatsCache } = chatQueries();
  const chats = getChatsCache();
  const { getSignedUserElseThrow } = useUserQueries();
  const user = getSignedUserElseThrow();
  const { data, isLoading, error } = useGetNotifications();

  // Create repository for domain logic (optional, but good for testing)
  const repository = useMemo(() => {
    return createNotificationRepository(config);
  }, [config]);

  // Calculate notification status using domain logic (maintains performance)
  const flattenedNotifications = useMemo(() => {
    return !!data ? data.pages.flatMap((page) => page.content) : [];
  }, [data]);

  const hasUnreadChat = useMemo(() => {
    return hasUnreadMessages(chats, String(user.id));
  }, [chats, user.id]);

  const hasPendingNotification = useMemo(() => {
    return hasPendingNotifications(flattenedNotifications);
  }, [flattenedNotifications]);

  const notificationData: NotificationStatusEntity = useMemo(() => {
    return createNotificationStatus(hasPendingNotification, hasUnreadChat, isLoading);
  }, [hasPendingNotification, hasUnreadChat, isLoading]);

  return {
    notificationData,
    error,
    isLoading,
    repository // Optional access to repository for testing
  };
};
