/**
 * Repository interface for notification and chat data.
 * 
 * This interface defines the contract for data access operations
 * related to notifications and chat status, following the Repository pattern.
 * It enables dependency inversion and makes the system testable with mock implementations.
 */

import type { NotificationStatusEntity } from "./entities";

/**
 * Interface for notification and chat data repository.
 * Abstracts the data source and provides clean domain-focused methods.
 */
export interface INotificationRepository {
  /**
   * Retrieves the current notification status including unread messages and pending notifications.
   * 
   * @returns {Promise<NotificationStatusEntity>} - The current notification status
   * @throws {Error} - When data retrieval fails
   */
  getNotificationStatus(): Promise<NotificationStatusEntity>;
  
  /**
   * Retrieves raw chat data for processing.
   * 
   * @returns {Promise<any[]>} - Array of chat objects
   * @throws {Error} - When chat data retrieval fails
   */
  getChatData(): Promise<any[]>;
  
  /**
   * Retrieves raw notification data for processing.
   * 
   * @returns {Promise<any[]>} - Array of notification objects
   * @throws {Error} - When notification data retrieval fails
   */
  getNotificationData(): Promise<any[]>;
  
  /**
   * Gets the current user ID for filtering operations.
   * 
   * @returns {Promise<string>} - Current user's ID
   * @throws {Error} - When user data retrieval fails
   */
  getCurrentUserId(): Promise<string>;
  
  /**
   * Checks if the repository is currently loading data.
   * 
   * @returns {boolean} - True if data is being fetched
   */
  isLoading(): boolean;
  
  /**
   * Gets any error that occurred during data operations.
   * 
   * @returns {Error | null} - Error object if an error occurred, null otherwise
   */
  getError(): Error | null;
}
