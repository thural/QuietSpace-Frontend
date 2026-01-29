import type { ICacheProvider } from '../../../../core/cache';
import { BaseDataService } from '../../../../core/dataservice/BaseDataService';
import type { IWebSocketService } from '../../../../core/websocket/types';
import { JwtToken } from '../../../../shared/api/models/common';
import type {
  NavigationItemEntity,
  NotificationStatusEntity,
  QuickActionsEntity,
  SearchSuggestionsEntity,
  SystemStatusEntity,
  ThemeConfigEntity,
  UserPreferencesEntity,
  UserProfileSummaryEntity
} from '../../domain/entities/entities';
import { INotificationRepository } from '../../domain/repositories/INotificationRepository';

/**
 * Navbar Data Service
 * 
 * Provides intelligent caching and orchestration for navbar data
 * Implements enterprise-grade caching with real-time updates and performance optimization
 * Extends BaseDataService for composed services and proper separation of concerns
 */
export class NavbarDataService extends BaseDataService {
  private notificationRepository: INotificationRepository;

  constructor(
    notificationRepository: INotificationRepository,
    cacheService: ICacheProvider,
    webSocketService: IWebSocketService
  ) {
    super(); // Initialize BaseDataService with composed services
    this.notificationRepository = notificationRepository;
  }

  /**
   * Get navigation items with caching
   */
  async getNavigationItems(userId?: string, token?: JwtToken): Promise<NavigationItemEntity[]> {
    const cacheKey = super.generateCacheKey('navigation-items', { userId });

    try {
      // Check cache first
      const cachedData = super.getCachedData<NavigationItemEntity[]>(cacheKey);
      if (cachedData) return cachedData;

      // Fetch from repository
      const data = await this.notificationRepository.getNavigationItems(userId, token);

      // Update cache
      super.updateCache(cacheKey, data);

      return data;
    } catch (error) {
      console.error('Failed to get navigation items:', error);
      throw error;
    }
  }

  /**
   * Get notification status with real-time caching
   */
  async getNotificationStatus(userId: string, token: JwtToken): Promise<NotificationStatusEntity> {
    const cacheKey = super.generateCacheKey('notification-status', { userId });

    try {
      // Check cache first
      const cachedData = super.getCachedData<NotificationStatusEntity>(cacheKey);
      if (cachedData) return cachedData;

      // Fetch from repository
      const data = await this.notificationRepository.getNotificationStatus();

      // Update cache
      super.updateCache(cacheKey, data);

      return data;
    } catch (error) {
      console.error('Failed to get notification status:', error);
      throw error;
    }
  }

  /**
   * Get chat status with caching
   */
  async getChatStatus(userId: string, token: JwtToken): Promise<any> {
    const cacheKey = super.generateCacheKey('chat-status', { userId });

    try {
      // Check cache first
      const cachedData = super.getCachedData<any>(cacheKey);
      if (cachedData) return cachedData;

      // Fetch from repository
      const data = await this.notificationRepository.getChatStatus(userId, token);

      // Update cache
      super.updateCache(cacheKey, data);

      return data;
    } catch (error) {
      console.error('Failed to get chat status:', error);
      throw error;
    }
  }

  /**
   * Get user profile summary with caching
   */
  async getUserProfileSummary(userId: string, token: JwtToken): Promise<UserProfileSummaryEntity> {
    const cacheKey = super.generateCacheKey('user-profile-summary', { userId });

    try {
      // Check cache first
      const cachedData = super.getCachedData<UserProfileSummaryEntity>(cacheKey);
      if (cachedData) return cachedData;

      // Fetch from repository
      const data = await this.notificationRepository.getUserProfileSummary(userId, token);

      // Update cache
      super.updateCache(cacheKey, data);

      return data;
    } catch (error) {
      console.error('Failed to get user profile summary:', error);
      throw error;
    }
  }

  /**
   * Get user preferences with caching
   */
  async getUserPreferences(userId: string, token: JwtToken): Promise<UserPreferencesEntity> {
    const cacheKey = super.generateCacheKey('user-preferences', { userId });

    try {
      // Check cache first
      const cachedData = super.getCachedData<UserPreferencesEntity>(cacheKey);
      if (cachedData) return cachedData;

      // Fetch from repository
      const data = await this.notificationRepository.getUserPreferences(userId, token);

      // Update cache
      super.updateCache(cacheKey, data);

      return data;
    } catch (error) {
      console.error('Failed to get user preferences:', error);
      throw error;
    }
  }

  /**
   * Get theme configuration with caching
   */
  async getThemeConfig(userId: string, token: JwtToken): Promise<ThemeConfigEntity> {
    const cacheKey = super.generateCacheKey('theme-config', { userId });

    try {
      // Check cache first
      const cachedData = super.getCachedData<ThemeConfigEntity>(cacheKey);
      if (cachedData) return cachedData;

      // Fetch from repository
      const data = await this.notificationRepository.getThemeConfig(userId, token);

      // Update cache
      super.updateCache(cacheKey, data);

      return data;
    } catch (error) {
      console.error('Failed to get theme config:', error);
      throw error;
    }
  }

  /**
   * Get search suggestions with caching
   */
  async getSearchSuggestions(query: string, userId: string, token: JwtToken): Promise<SearchSuggestionsEntity[]> {
    const cacheKey = super.generateCacheKey('search-suggestions', { query, userId });

    try {
      // Check cache first
      const cachedData = super.getCachedData<SearchSuggestionsEntity[]>(cacheKey);
      if (cachedData) return cachedData;

      // Fetch from repository
      const data = await this.notificationRepository.getSearchSuggestions(query, userId, token);

      // Update cache
      super.updateCache(cacheKey, data);

      return data;
    } catch (error) {
      console.error('Failed to get search suggestions:', error);
      throw error;
    }
  }

  /**
   * Get quick actions with caching
   */
  async getQuickActions(userId: string, token: JwtToken): Promise<QuickActionsEntity[]> {
    const cacheKey = super.generateCacheKey('quick-actions', { userId });

    try {
      // Check cache first
      const cachedData = super.getCachedData<QuickActionsEntity[]>(cacheKey);
      if (cachedData) return cachedData;

      // Fetch from repository
      const data = await this.notificationRepository.getQuickActions(userId, token);

      // Update cache
      super.updateCache(cacheKey, data);

      return data;
    } catch (error) {
      console.error('Failed to get quick actions:', error);
      throw error;
    }
  }

  /**
   * Get system status with caching
   */
  async getSystemStatus(): Promise<SystemStatusEntity> {
    const cacheKey = super.generateCacheKey('system-status', {});

    try {
      // Check cache first
      const cachedData = super.getCachedData<SystemStatusEntity>(cacheKey);
      if (cachedData) return cachedData;

      // Fetch from repository
      const data = await this.notificationRepository.getSystemStatus();

      // Update cache
      super.updateCache(cacheKey, data);

      return data;
    } catch (error) {
      console.error('Failed to get system status:', error);
      throw error;
    }
  }

  /**
   * Invalidate navbar cache for user
   */
  async invalidateUserNavbar(userId: string): Promise<void> {
    try {
      // Use BaseDataService cache invalidation
      const cacheKeys = [
        super.generateCacheKey('navigation-items', { userId }),
        super.generateCacheKey('notification-status', { userId }),
        super.generateCacheKey('chat-status', { userId }),
        super.generateCacheKey('user-profile-summary', { userId }),
        super.generateCacheKey('user-preferences', { userId }),
        super.generateCacheKey('theme-config', { userId }),
        super.generateCacheKey('quick-actions', { userId })
      ];

      // Invalidate all user-related cache entries
      cacheKeys.forEach(key => super.invalidateCache(key));
    } catch (error) {
      console.error('Failed to invalidate user navbar cache:', error);
    }
  }

  /**
   * Invalidate notification-related cache
   */
  async invalidateNotifications(userId: string): Promise<void> {
    try {
      // Use BaseDataService cache invalidation
      const cacheKeys = [
        super.generateCacheKey('notification-status', { userId }),
        super.generateCacheKey('chat-status', { userId })
      ];

      // Invalidate notification-related cache entries
      cacheKeys.forEach(key => super.invalidateCache(key));
    } catch (error) {
      console.error('Failed to invalidate notification cache:', error);
    }
  }

  /**
   * Invalidate chat-related cache
   */
  async invalidateChat(userId: string): Promise<void> {
    try {
      // Use BaseDataService cache invalidation
      const cacheKeys = [
        super.generateCacheKey('chat-status', { userId }),
        super.generateCacheKey('search-suggestions', { userId })
      ];

      // Invalidate chat-related cache entries
      cacheKeys.forEach(key => super.invalidateCache(key));
    } catch (error) {
      console.error('Failed to invalidate chat cache:', error);
    }
  }

  /**
   * Warm essential navbar data for user
   */
  async warmEssentialData(userId: string, token: JwtToken): Promise<void> {
    try {
      // Use BaseDataService to warm essential data
      await Promise.all([
        this.getNavigationItems(userId, token),
        this.getNotificationStatus(userId, token),
        this.getChatStatus(userId, token),
        this.getUserProfileSummary(userId, token),
        this.getQuickActions(userId, token)
      ]);
    } catch (error) {
      console.error('Failed to warm essential navbar data:', error);
    }
  }

  /**
   * Get cache statistics for monitoring
   */
  async getCacheStats(): Promise<any> {
    try {
      // Use BaseDataService cache statistics
      return super.getCacheStats();
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return null;
    }
  }

  // Private helper methods for fetching data
  private async fetchNavigationItems(userId?: string, token?: JwtToken): Promise<NavigationItemEntity[]> {
    // Implementation would fetch navigation items from API
    return []; // Placeholder
  }

  private async fetchChatStatus(userId: string, token: JwtToken): Promise<NotificationStatusEntity> {
    // Implementation would fetch chat status from API
    return {
      hasPendingNotification: false,
      hasUnreadChat: false,
      isLoading: false
    }; // Placeholder
  }

  private async fetchUserProfileSummary(userId: string, token: JwtToken): Promise<UserProfileSummaryEntity> {
    // Implementation would fetch user profile summary from API
    return {
      id: userId,
      username: '',
      displayName: '',
      avatar: '',
      email: '',
      isOnline: false,
      lastSeen: undefined
    }; // Placeholder
  }

  private async fetchUserPreferences(userId: string, token: JwtToken): Promise<UserPreferencesEntity> {
    // Implementation would fetch user preferences from API
    return {
      theme: 'light',
      language: 'en',
      notifications: true,
      sounds: true,
      autoPlay: true
    }; // Placeholder
  }

  private async fetchThemeConfig(userId?: string, token?: JwtToken): Promise<ThemeConfigEntity> {
    // Implementation would fetch theme config from API
    return {
      primaryColor: '#007bff',
      secondaryColor: '#6c757d',
      backgroundColor: '#ffffff',
      textColor: '#333333',
      mode: 'light'
    }; // Placeholder
  }

  private async fetchSearchSuggestions(query: string, userId: string, token: JwtToken): Promise<SearchSuggestionsEntity[]> {
    // Implementation would fetch search suggestions from API
    return []; // Placeholder
  }

  private async fetchQuickActions(userId: string, token: JwtToken): Promise<QuickActionsEntity[]> {
    // Implementation would fetch quick actions from API
    return []; // Placeholder
  }

  private async fetchSystemStatus(token?: JwtToken): Promise<SystemStatusEntity> {
    // Implementation would fetch system status from API
    return {
      status: 'online',
      lastChecked: new Date(),
      services: {
        api: true,
        websocket: true,
        cache: true
      }
    }; // Placeholder
  }
}
