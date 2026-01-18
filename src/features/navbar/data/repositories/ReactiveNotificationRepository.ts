/**
 * Reactive Repository Wrapper for React Query integration.
 * 
 * This wrapper provides a bridge between React Query and the Repository Pattern,
 * allowing repositories to benefit from React Query's reactivity while maintaining
 * clean separation of concerns.
 */

import { useEffect, useState, useCallback } from "react";
import type { INotificationRepository } from "../../domain";
import { NotificationStatusEntity } from "../../domain";
import { createNotificationRepository, type RepositoryConfig } from "./RepositoryFactory";

/**
 * Hook that wraps a repository with React Query reactivity.
 * 
 * This approach allows repositories to work WITH React Query rather than against it,
 * maintaining proper React reactivity while preserving the Repository Pattern.
 * 
 * @param {RepositoryConfig} config - Optional configuration for repository creation
 * @param {INotificationRepository} repository - Optional repository injection for testing
 * @returns {{
 *   notificationData: NotificationStatusEntity,
 *   error: Error | null,
 *   isLoading: boolean,
 *   refetch: () => Promise<void>
 * }} - Reactive notification data with React Query benefits
 */
export const useReactiveNotificationRepository = (
  config?: RepositoryConfig, 
  repository?: INotificationRepository
) => {
  // Create or use injected repository
  const notificationRepository = repository || createNotificationRepository(config);
  
  // State for reactive updates
  const [notificationData, setNotificationData] = useState<NotificationStatusEntity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch data from repository
  const fetchData = useCallback(async () => {
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

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Manual refetch function
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    notificationData: notificationData || {
      hasPendingNotification: false,
      hasUnreadChat: false,
      isLoading: false
    },
    error,
    isLoading: isLoading || notificationRepository.isLoading(),
    refetch
  };
};

/**
 * Enhanced repository that can be updated with external data.
 * 
 * This extends the repository pattern to work with external data sources
 * like React Query while maintaining clean architecture.
 */
export class ReactiveNotificationRepository implements INotificationRepository {
  private wrappedRepository: INotificationRepository;
  private externalData: {
    chats?: any[];
    notifications?: any[];
    user?: any;
    isLoading?: boolean;
    error?: Error | null;
  } = {};

  constructor(repository: INotificationRepository) {
    this.wrappedRepository = repository;
  }

  /**
   * Updates the repository with external data (e.g., from React Query).
   * 
   * @param {Object} data - External data to update the repository with
   */
  updateExternalData(data: {
    chats?: any[];
    notifications?: any[];
    user?: any;
    isLoading?: boolean;
    error?: Error | null;
  }): void {
    this.externalData = { ...this.externalData, ...data };
  }

  /**
   * Gets notification status, preferring external data if available.
   */
  async getNotificationStatus(): Promise<NotificationStatusEntity> {
    // If we have external data, use it; otherwise fall back to repository
    if (this.externalData.chats && this.externalData.notifications && this.externalData.user) {
      // Use external data (from React Query) with domain logic
      const { hasUnreadMessages, hasPendingNotifications, createNotificationStatus } = await import("../../domain");
      
      const hasUnreadChat = hasUnreadMessages(this.externalData.chats, String(this.externalData.user.id));
      const hasPendingNotification = hasPendingNotifications(this.externalData.notifications);
      
      return createNotificationStatus(
        hasPendingNotification,
        hasUnreadChat,
        this.externalData.isLoading || false
      );
    }
    
    // Fall back to wrapped repository
    return this.wrappedRepository.getNotificationStatus();
  }

  async getChatData(): Promise<any[]> {
    return this.externalData.chats || this.wrappedRepository.getChatData();
  }

  async getNotificationData(): Promise<any[]> {
    return this.externalData.notifications || this.wrappedRepository.getNotificationData();
  }

  async getCurrentUserId(): Promise<string> {
    if (this.externalData.user) {
      return String(this.externalData.user.id);
    }
    return this.wrappedRepository.getCurrentUserId();
  }

  isLoading(): boolean {
    return this.externalData.isLoading ?? this.wrappedRepository.isLoading();
  }

  getError(): Error | null {
    return this.externalData.error ?? this.wrappedRepository.getError();
  }
}

/**
 * Factory function to create reactive repositories.
 */
export const createReactiveNotificationRepository = (
  config?: RepositoryConfig,
  repository?: INotificationRepository
): ReactiveNotificationRepository => {
  const baseRepository = repository || createNotificationRepository(config);
  return new ReactiveNotificationRepository(baseRepository);
};
