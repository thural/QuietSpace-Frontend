/**
 * Repository interface for notification and chat data.
 * 
 * This interface defines the contract for data access operations
 * related to notifications and chat status, following the Repository pattern.
 * It enables dependency inversion and makes the system testable with mock implementations.
 */

import type {
  NotificationStatusEntity,
  NavigationItemEntity,
  UserProfileSummaryEntity,
  UserPreferencesEntity,
  ThemeConfigEntity,
  SearchSuggestionsEntity,
  QuickActionsEntity,
  SystemStatusEntity
} from "../entities/entities";
import { JwtToken } from '@shared/api/models/common';

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

  // Additional methods needed by NavbarDataService

  /**
   * Retrieves navigation items for the user.
   * 
   * @param {string} userId - User ID
   * @param {JwtToken} token - Authentication token
   * @returns {Promise<NavigationItemEntity[]>} - Navigation items
   * @throws {Error} - When navigation data retrieval fails
   */
  getNavigationItems(userId?: string, token?: JwtToken): Promise<NavigationItemEntity[]>;

  /**
   * Retrieves chat status for the user.
   * 
   * @param {string} userId - User ID
   * @param {JwtToken} token - Authentication token
   * @returns {Promise<any>} - Chat status data
   * @throws {Error} - When chat status retrieval fails
   */
  getChatStatus(userId: string, token: JwtToken): Promise<any>;

  /**
   * Retrieves user profile summary.
   * 
   * @param {string} userId - User ID
   * @param {JwtToken} token - Authentication token
   * @returns {Promise<UserProfileSummaryEntity>} - User profile summary
   * @throws {Error} - When profile data retrieval fails
   */
  getUserProfileSummary(userId: string, token: JwtToken): Promise<UserProfileSummaryEntity>;

  /**
   * Retrieves user preferences.
   * 
   * @param {string} userId - User ID
   * @param {JwtToken} token - Authentication token
   * @returns {Promise<UserPreferencesEntity>} - User preferences
   * @throws {Error} - When preferences retrieval fails
   */
  getUserPreferences(userId: string, token: JwtToken): Promise<UserPreferencesEntity>;

  /**
   * Retrieves theme configuration.
   * 
   * @param {string} userId - User ID
   * @param {JwtToken} token - Authentication token
   * @returns {Promise<ThemeConfigEntity>} - Theme configuration
   * @throws {Error} - When theme data retrieval fails
   */
  getThemeConfig(userId: string, token: JwtToken): Promise<ThemeConfigEntity>;

  /**
   * Retrieves search suggestions.
   * 
   * @param {string} query - Search query
   * @param {string} userId - User ID
   * @param {JwtToken} token - Authentication token
   * @returns {Promise<SearchSuggestionsEntity[]>} - Search suggestions
   * @throws {Error} - When search suggestions retrieval fails
   */
  getSearchSuggestions(query: string, userId: string, token: JwtToken): Promise<SearchSuggestionsEntity[]>;

  /**
   * Retrieves quick actions for the user.
   * 
   * @param {string} userId - User ID
   * @param {JwtToken} token - Authentication token
   * @returns {Promise<QuickActionsEntity[]>} - Quick actions
   * @throws {Error} - When quick actions retrieval fails
   */
  getQuickActions(userId: string, token: JwtToken): Promise<QuickActionsEntity[]>;

  /**
   * Retrieves system status.
   * 
   * @returns {Promise<SystemStatusEntity>} - System status
   * @throws {Error} - When system status retrieval fails
   */
  getSystemStatus(): Promise<SystemStatusEntity>;
}
