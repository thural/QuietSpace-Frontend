/**
 * Concrete implementation of notification repository.
 * 
 * This class implements the INotificationRepository interface and handles
 * actual data fetching from external APIs (React Query, WebSocket, etc.).
 * It transforms raw API responses into domain entities.
 * 
 * Note: This implementation is designed to work with React hooks by accepting
 * hook results as parameters rather than calling hooks directly.
 */

import type { INotificationRepository } from "../../domain";
import { createNotificationStatus, hasUnreadMessages, hasPendingNotifications, NotificationStatusEntity } from "../../domain";

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
    // Constructor is now lightweight - data is initialized via initialize method
  }

  /**
   * Initializes the repository with data from React hooks.
   * This method should be called with data from React hooks to avoid
   * calling hooks directly in the class constructor.
   * 
   * @param {any} chatData - Chat data from chatQueries()
   * @param {any} userData - User data from useUserQueries()
   * @param {any} notificationData - Notification data from useGetNotifications()
   */
  initializeWithReactData(chatData: any, userData: any, notificationData: any): void {
    try {
      // Store chat data
      this.chats = chatData;

      // Store user data
      this.user = userData;

      // Store notification data and loading/error states
      if (notificationData) {
        this.notifications = !!notificationData.data 
          ? notificationData.data.pages.flatMap((page: any) => page.content) 
          : [];
        this.loadingState = notificationData.isLoading;
        this.error = notificationData.error;
      }
    } catch (err) {
      this.error = err as Error;
      this.loadingState = false;
    }
  }

  /**
   * Updates repository data when React hooks data changes.
   * This method should be called whenever the underlying React Query data changes.
   * 
   * @param {any} chatData - Updated chat data
   * @param {any} userData - Updated user data
   * @param {any} notificationData - Updated notification data
   */
  updateReactData(chatData: any, userData: any, notificationData: any): void {
    this.initializeWithReactData(chatData, userData, notificationData);
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
