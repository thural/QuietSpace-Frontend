import { TYPES } from '@/core/di/types';
import { createCacheProvider, type ICacheProvider } from '@/core/cache';
import { INotificationRepository, NotificationQuery, NotificationFilters, NotificationSettings, NotificationPreferences, PushNotificationStatus, PushSubscription, DeviceToken, QuietHours } from '../../domain/entities/INotificationRepository';
import { NotificationPage, NotificationResponse, NotificationType } from '../models/notification';
import { JwtToken } from '@/shared/api/models/common';
import { NOTIFICATION_CACHE_KEYS, NOTIFICATION_CACHE_TTL, NOTIFICATION_CACHE_INVALIDATION } from '../cache/NotificationCacheKeys';

/**
 * Notification Data Service
 * 
 * Provides intelligent caching and orchestration for notification data
 * Implements enterprise-grade caching with real-time notification strategies
 */
export class NotificationDataService {
  constructor(
    private cache: ICacheProvider,
    private repository: INotificationRepository
  ) { }

  // Core notification operations with caching
  async getUserNotifications(userId: string, query: Partial<NotificationQuery> = {}, token: JwtToken): Promise<NotificationPage> {
    const page = query.page || 0;
    const size = query.size || 20;
    const cacheKey = NOTIFICATION_CACHE_KEYS.USER_NOTIFICATIONS(userId, page, size);

    // Cache-first lookup with real-time TTL
    let data = this.cache.get<NotificationPage>(cacheKey);
    if (data) return data;

    try {
      const fullQuery: NotificationQuery = { userId, page, size, ...query };
      data = await this.repository.getNotifications(fullQuery, token);

      if (data) {
        this.cache.set(cacheKey, data, NOTIFICATION_CACHE_TTL.USER_NOTIFICATIONS);
      }

      return data;
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw error;
    }
  }

  async getNotificationsByType(userId: string, type: NotificationType, query: Partial<NotificationQuery> = {}, token: JwtToken): Promise<NotificationPage> {
    const page = query.page || 0;
    const size = query.size || 20;
    const cacheKey = NOTIFICATION_CACHE_KEYS.NOTIFICATIONS_BY_TYPE(userId, type, page, size);

    let data = this.cache.get<NotificationPage>(cacheKey);
    if (data) return data;

    try {
      const fullQuery: NotificationQuery = { userId, page, size, ...query };
      data = await this.repository.getNotificationsByType(type, fullQuery, token);

      if (data) {
        this.cache.set(cacheKey, data, NOTIFICATION_CACHE_TTL.NOTIFICATIONS_BY_TYPE);
      }

      return data;
    } catch (error) {
      console.error('Error fetching notifications by type:', error);
      throw error;
    }
  }

  async getUnreadCount(userId: string, token: JwtToken): Promise<number> {
    const cacheKey = NOTIFICATION_CACHE_KEYS.UNREAD_COUNT(userId);

    // Very short TTL for real-time updates
    let data = this.cache.get<number>(cacheKey);
    if (data) return data;

    try {
      data = await this.repository.getUnreadNotificationsCount(userId, token);

      if (data !== undefined) {
        this.cache.set(cacheKey, data, NOTIFICATION_CACHE_TTL.UNREAD_COUNT);
      }

      return data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  async getNotificationById(notificationId: string, token: JwtToken): Promise<NotificationResponse | null> {
    const cacheKey = NOTIFICATION_CACHE_KEYS.NOTIFICATION(notificationId);

    let data = this.cache.get<NotificationResponse>(cacheKey);
    if (data) return data;

    try {
      data = await this.repository.getNotificationById(notificationId, token);

      if (data) {
        this.cache.set(cacheKey, data, NOTIFICATION_CACHE_TTL.NOTIFICATION);
      }

      return data;
    } catch (error) {
      console.error('Error fetching notification by ID:', error);
      return null;
    }
  }

  // Notification status operations
  async markAsRead(notificationId: string, token: JwtToken): Promise<NotificationResponse> {
    try {
      const result = await this.repository.markNotificationAsSeen(notificationId, token);

      // Invalidate relevant caches
      this.cache.delete(NOTIFICATION_CACHE_KEYS.NOTIFICATION(notificationId));
      this.invalidateUserNotificationCaches(result.recipientId || 'unknown');

      return result;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markMultipleAsRead(notificationIds: string[], token: JwtToken): Promise<NotificationResponse[]> {
    try {
      const results = await this.repository.markMultipleNotificationsAsSeen(notificationIds, token);

      // Invalidate caches for all affected notifications
      notificationIds.forEach(id => {
        this.cache.delete(NOTIFICATION_CACHE_KEYS.NOTIFICATION(id));
      });

      // Invalidate user notification caches
      if (results.length > 0) {
        this.invalidateUserNotificationCaches(results[0].recipientId || 'unknown');
      }

      return results;
    } catch (error) {
      console.error('Error marking multiple notifications as read:', error);
      throw error;
    }
  }

  // Notification management
  async deleteNotification(notificationId: string, token: JwtToken): Promise<void> {
    try {
      await this.repository.deleteNotification(notificationId, token);

      // Invalidate caches
      this.cache.delete(NOTIFICATION_CACHE_KEYS.NOTIFICATION(notificationId));
      this.cache.delete(NOTIFICATION_CACHE_KEYS.DELIVERY_STATUS(notificationId));
      this.cache.delete(NOTIFICATION_CACHE_KEYS.METADATA(notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  async searchNotifications(userId: string, searchQuery: string, filters?: NotificationFilters, token: JwtToken): Promise<NotificationPage> {
    const page = filters?.page || 0;
    const cacheKey = NOTIFICATION_CACHE_KEYS.SEARCH_RESULTS(userId, searchQuery, page);

    let data = this.cache.get<NotificationPage>(cacheKey);
    if (data) return data;

    try {
      const query: NotificationQuery = { userId, page, ...filters };
      data = await this.repository.searchNotifications(searchQuery, query, token);

      if (data) {
        this.cache.set(cacheKey, data, NOTIFICATION_CACHE_TTL.SEARCH_RESULTS);
      }

      return data;
    } catch (error) {
      console.error('Error searching notifications:', error);
      throw error;
    }
  }

  // Notification settings and preferences
  async getNotificationSettings(userId: string, token: JwtToken): Promise<NotificationSettings | null> {
    const cacheKey = NOTIFICATION_CACHE_KEYS.SETTINGS(userId);

    let data = this.cache.get<NotificationSettings>(cacheKey);
    if (data) return data;

    try {
      data = await this.repository.getNotificationSettings(userId, token);

      if (data) {
        this.cache.set(cacheKey, data, NOTIFICATION_CACHE_TTL.SETTINGS);
      }

      return data;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      return null;
    }
  }

  async updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>, token: JwtToken): Promise<NotificationSettings> {
    try {
      const result = await this.repository.updateNotificationSettings(userId, settings, token);

      // Update cache
      const cacheKey = NOTIFICATION_CACHE_KEYS.SETTINGS(userId);
      this.cache.set(cacheKey, result, NOTIFICATION_CACHE_TTL.SETTINGS);

      return result;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  }

  // Push notification operations
  async getPushNotificationStatus(userId: string, token: JwtToken): Promise<PushNotificationStatus | null> {
    const cacheKey = NOTIFICATION_CACHE_KEYS.PUSH_STATUS(userId);

    let data = this.cache.get<PushNotificationStatus>(cacheKey);
    if (data) return data;

    try {
      data = await this.repository.getPushNotificationStatus(userId, token);

      if (data) {
        this.cache.set(cacheKey, data, NOTIFICATION_CACHE_TTL.PUSH_STATUS);
      }

      return data;
    } catch (error) {
      console.error('Error fetching push notification status:', error);
      return null;
    }
  }

  async updatePushNotificationStatus(userId: string, status: Partial<PushNotificationStatus>, token: JwtToken): Promise<PushNotificationStatus> {
    try {
      const result = await this.repository.updatePushNotificationStatus(userId, status, token);

      // Update cache
      const cacheKey = NOTIFICATION_CACHE_KEYS.PUSH_STATUS(userId);
      this.cache.set(cacheKey, result, NOTIFICATION_CACHE_TTL.PUSH_STATUS);

      return result;
    } catch (error) {
      console.error('Error updating push notification status:', error);
      throw error;
    }
  }

  async getPushSubscription(userId: string, token: JwtToken): Promise<PushSubscription | null> {
    const cacheKey = NOTIFICATION_CACHE_KEYS.PUSH_SUBSCRIPTION(userId);

    let data = this.cache.get<PushSubscription>(cacheKey);
    if (data) return data;

    try {
      data = await this.repository.getPushSubscription(userId, token);

      if (data) {
        this.cache.set(cacheKey, data, NOTIFICATION_CACHE_TTL.PUSH_SUBSCRIPTION);
      }

      return data;
    } catch (error) {
      console.error('Error fetching push subscription:', error);
      return null;
    }
  }

  async updatePushSubscription(userId: string, subscription: PushSubscription, token: JwtToken): Promise<PushSubscription> {
    try {
      const result = await this.repository.updatePushSubscription(userId, subscription, token);

      // Update cache
      const cacheKey = NOTIFICATION_CACHE_KEYS.PUSH_SUBSCRIPTION(userId);
      this.cache.set(cacheKey, result, NOTIFICATION_CACHE_TTL.PUSH_SUBSCRIPTION);

      // Invalidate push status cache
      this.cache.delete(NOTIFICATION_CACHE_KEYS.PUSH_STATUS(userId));

      return result;
    } catch (error) {
      console.error('Error updating push subscription:', error);
      throw error;
    }
  }

  async removePushSubscription(userId: string, token: JwtToken): Promise<void> {
    try {
      await this.repository.removePushSubscription(userId, token);

      // Invalidate caches
      this.cache.delete(NOTIFICATION_CACHE_KEYS.PUSH_SUBSCRIPTION(userId));
      this.cache.delete(NOTIFICATION_CACHE_KEYS.PUSH_STATUS(userId));
      this.cache.delete(NOTIFICATION_CACHE_KEYS.DEVICE_TOKENS(userId));
    } catch (error) {
      console.error('Error removing push subscription:', error);
      throw error;
    }
  }

  // Device management
  async getDeviceTokens(userId: string, token: JwtToken): Promise<DeviceToken[]> {
    const cacheKey = NOTIFICATION_CACHE_KEYS.DEVICE_TOKENS(userId);

    let data = this.cache.get<DeviceToken[]>(cacheKey);
    if (data) return data;

    try {
      data = await this.repository.getDeviceTokens(userId, token);

      if (data) {
        this.cache.set(cacheKey, data, NOTIFICATION_CACHE_TTL.DEVICE_TOKENS);
      }

      return data;
    } catch (error) {
      console.error('Error fetching device tokens:', error);
      return [];
    }
  }

  async registerDeviceToken(userId: string, deviceToken: Omit<DeviceToken, 'id' | 'createdAt' | 'lastUsedAt'>, token: JwtToken): Promise<DeviceToken> {
    try {
      const result = await this.repository.registerDeviceToken(userId, deviceToken, token);

      // Invalidate device tokens cache
      this.cache.delete(NOTIFICATION_CACHE_KEYS.DEVICE_TOKENS(userId));

      return result;
    } catch (error) {
      console.error('Error registering device token:', error);
      throw error;
    }
  }

  async removeDeviceToken(userId: string, tokenId: string, token: JwtToken): Promise<void> {
    try {
      await this.repository.removeDeviceToken(userId, tokenId, token);

      // Invalidate device tokens cache
      this.cache.delete(NOTIFICATION_CACHE_KEYS.DEVICE_TOKENS(userId));
    } catch (error) {
      console.error('Error removing device token:', error);
      throw error;
    }
  }

  // Quiet hours management
  async getQuietHours(userId: string, token: JwtToken): Promise<QuietHours | null> {
    const cacheKey = NOTIFICATION_CACHE_KEYS.QUIET_HOURS(userId);

    let data = this.cache.get<QuietHours>(cacheKey);
    if (data) return data;

    try {
      data = await this.repository.getQuietHours(userId, token);

      if (data) {
        this.cache.set(cacheKey, data, NOTIFICATION_CACHE_TTL.QUIET_HOURS);
      }

      return data;
    } catch (error) {
      console.error('Error fetching quiet hours:', error);
      return null;
    }
  }

  async updateQuietHours(userId: string, quietHours: QuietHours, token: JwtToken): Promise<QuietHours> {
    try {
      const result = await this.repository.updateQuietHours(userId, quietHours, token);

      // Update cache
      const cacheKey = NOTIFICATION_CACHE_KEYS.QUIET_HOURS(userId);
      this.cache.set(cacheKey, result, NOTIFICATION_CACHE_TTL.QUIET_HOURS);

      return result;
    } catch (error) {
      console.error('Error updating quiet hours:', error);
      throw error;
    }
  }

  // Cache management utilities
  private invalidateUserNotificationCaches(userId: string): void {
    const patterns = NOTIFICATION_CACHE_INVALIDATION.invalidateUserNotifications(userId);
    patterns.forEach(pattern => this.cache.invalidatePattern(pattern));
  }

  invalidateAllUserCaches(userId: string): void {
    const patterns = NOTIFICATION_CACHE_INVALIDATION.invalidateAllUserCaches(userId);
    patterns.forEach(pattern => this.cache.invalidatePattern(pattern));
  }

  invalidateRealtimeCaches(userId: string): void {
    const patterns = NOTIFICATION_CACHE_INVALIDATION.invalidateRealtimeCaches(userId);
    patterns.forEach(pattern => this.cache.invalidatePattern(pattern));
  }

  // Cache statistics and monitoring
  getCacheStats() {
    return this.cache.getStats();
  }

  clearCache(): void {
    this.cache.clear();
  }

  // Real-time queue management
  async getRealtimeQueue(userId: string, token: JwtToken): Promise<any[]> {
    const cacheKey = NOTIFICATION_CACHE_KEYS.REALTIME_QUEUE(userId);

    let data = this.cache.get<any[]>(cacheKey);
    if (data) return data;

    try {
      // This would be implemented in the repository
      // data = await this.repository.getRealtimeNotificationQueue(userId, token);
      data = []; // Placeholder

      if (data) {
        this.cache.set(cacheKey, data, NOTIFICATION_CACHE_TTL.REALTIME_QUEUE);
      }

      return data;
    } catch (error) {
      console.error('Error fetching realtime queue:', error);
      return [];
    }
  }
}
