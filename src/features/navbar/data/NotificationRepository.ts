/**
 * Concrete implementation of notification repository.
 * 
 * This class implements the INotificationRepository interface and handles
 * actual data fetching from external APIs (React Query, WebSocket, etc.).
 * It transforms raw API responses into domain entities.
 */

import chatQueries from "@/api/queries/chatQueries";
import useUserQueries from "@/api/queries/userQueries";
import { useGetNotifications } from "@/services/data/useNotificationData";
import { useMemo } from "react";
import type { INotificationRepository } from "../domain/INotificationRepository";
import { createNotificationStatus, hasUnreadMessages, hasPendingNotifications, NotificationStatusEntity } from "../domain";

/**
 * Concrete repository implementation using React Query for data fetching.
 * This is the production implementation that connects to real APIs.
 */
export class NotificationRepository implements INotificationRepository {
  private chats: any[] | undefined;
  private notifications: any[] | undefined;
  private user: any;
  private loadingState: boolean = false;
  private error: Error | null = null;

  constructor() {
    // Initialize data fetching hooks
    this.initializeDataFetching();
  }

  /**
   * Initializes data fetching using React Query hooks.
   * This method sets up the data sources and manages loading/error states.
   */
  private initializeDataFetching(): void {
    try {
      // Get chat data
      const { getChatsCache } = chatQueries();
      this.chats = getChatsCache();

      // Get user data
      const { getSignedUserElseThrow } = useUserQueries();
      this.user = getSignedUserElseThrow();

      // Get notification data
      const { data, isLoading, error } = useGetNotifications();
      
      this.loadingState = isLoading;
      this.error = error;
      
      // Flatten paginated notification data
      this.notifications = !!data ? data.pages.flatMap((page) => page.content) : [];
    } catch (err) {
      this.error = err as Error;
      this.loadingState = false;
    }
  }

  /**
   * Retrieves the current notification status.
   * 
   * @returns {Promise<NotificationStatusEntity>} - Current notification status
   */
  async getNotificationStatus(): Promise<NotificationStatusEntity> {
    try {
      const userId = await this.getCurrentUserId();
      const chatData = await this.getChatData();
      const notificationData = await this.getNotificationData();

      const hasUnreadChat = hasUnreadMessages(chatData, userId);
      const hasPendingNotification = hasPendingNotifications(notificationData);

      return createNotificationStatus(
        hasPendingNotification,
        hasUnreadChat,
        this.loadingState
      );
    } catch (error) {
      this.error = error as Error;
      throw error;
    }
  }

  /**
   * Retrieves chat data.
   * 
   * @returns {Promise<any[]>} - Array of chat objects
   */
  async getChatData(): Promise<any[]> {
    if (!this.chats) {
      throw new Error("Chat data not available");
    }
    return this.chats;
  }

  /**
   * Retrieves notification data.
   * 
   * @returns {Promise<any[]>} - Array of notification objects
   */
  async getNotificationData(): Promise<any[]> {
    if (!this.notifications) {
      throw new Error("Notification data not available");
    }
    return this.notifications;
  }

  /**
   * Gets the current user ID.
   * 
   * @returns {Promise<string>} - Current user's ID
   */
  async getCurrentUserId(): Promise<string> {
    if (!this.user || !this.user.id) {
      throw new Error("User data not available");
    }
    return String(this.user.id);
  }

  /**
   * Checks if data is currently loading.
   * 
   * @returns {boolean} - True if loading
   */
  isLoading(): boolean {
    return this.loadingState;
  }

  /**
   * Gets any error that occurred.
   * 
   * @returns {Error | null} - Error object or null
   */
  getError(): Error | null {
    return this.error;
  }
}
