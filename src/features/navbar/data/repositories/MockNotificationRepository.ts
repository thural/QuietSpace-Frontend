/**
 * Mock implementation of notification repository.
 * 
 * This class provides a mock implementation of INotificationRepository
 * for testing purposes and UI development without backend dependencies.
 * It simulates realistic data and loading states for development and testing.
 */

import type { INotificationRepository } from "../../domain";
import { NotificationStatusEntity } from "../../domain";

/**
 * Mock repository implementation for testing and UI development.
 * Provides predictable data without requiring actual API connections.
 */
export class MockNotificationRepository implements INotificationRepository {
  private mockLoadingState: boolean = false;
  private mockError: Error | null = null;
  private mockNotificationStatus: NotificationStatusEntity;

  constructor(
    private config: {
      hasPendingNotifications?: boolean;
      hasUnreadChats?: boolean;
      simulateLoading?: boolean;
      simulateError?: boolean;
    } = {}
  ) {
    this.mockNotificationStatus = {
      hasPendingNotification: config.hasPendingNotifications ?? false,
      hasUnreadChat: config.hasUnreadChats ?? false,
      isLoading: config.simulateLoading ?? false
    };
  }

  /**
   * Retrieves the current notification status.
   * Simulates async behavior with optional delays and errors.
   * 
   * @returns {Promise<NotificationStatusEntity>} - Mock notification status
   */
  async getNotificationStatus(): Promise<NotificationStatusEntity> {
    // Simulate async delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Simulate error if configured
    if (this.config.simulateError) {
      this.mockError = new Error("Mock error for testing");
      throw this.mockError;
    }

    // Simulate loading state
    if (this.config.simulateLoading) {
      this.mockLoadingState = true;
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.mockLoadingState = false;
    }

    return this.mockNotificationStatus;
  }

  /**
   * Retrieves mock chat data.
   * 
   * @returns {Promise<any[]>} - Mock chat array
   */
  async getChatData(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return [
      {
        id: "chat1",
        recentMessage: {
          isSeen: !this.config.hasUnreadChats,
          senderId: this.config.hasUnreadChats ? "otherUser" : "currentUser",
          message: "Hello there!"
        }
      },
      {
        id: "chat2", 
        recentMessage: {
          isSeen: true,
          senderId: "currentUser",
          message: "How are you?"
        }
      }
    ];
  }

  /**
   * Retrieves mock notification data.
   * 
   * @returns {Promise<any[]>} - Mock notification array
   */
  async getNotificationData(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return [
      {
        id: "notif1",
        isSeen: !this.config.hasPendingNotifications,
        message: "New message received"
      },
      {
        id: "notif2",
        isSeen: true,
        message: "Your post was liked"
      }
    ];
  }

  /**
   * Gets the current user ID.
   * 
   * @returns {Promise<string>} - Mock user ID
   */
  async getCurrentUserId(): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 10));
    return "currentUser";
  }

  /**
   * Checks if mock data is loading.
   * 
   * @returns {boolean} - Mock loading state
   */
  isLoading(): boolean {
    return this.mockLoadingState;
  }

  /**
   * Gets any mock error.
   * 
   * @returns {Error | null} - Mock error or null
   */
  getError(): Error | null {
    return this.mockError;
  }

  /**
   * Updates mock configuration for testing different scenarios.
   * 
   * @param {Partial<typeof this.config>} newConfig - New configuration
   */
  updateMockConfig(newConfig: Partial<typeof this.config>): void {
    this.config = { ...this.config, ...newConfig };
    this.mockNotificationStatus = {
      hasPendingNotification: this.config.hasPendingNotifications ?? false,
      hasUnreadChat: this.config.hasUnreadChats ?? false,
      isLoading: this.config.simulateLoading ?? false
    };
  }

  /**
   * Resets mock state to defaults.
   */
  reset(): void {
    this.config = {};
    this.mockLoadingState = false;
    this.mockError = null;
    this.mockNotificationStatus = {
      hasPendingNotification: false,
      hasUnreadChat: false,
      isLoading: false
    };
  }
}
