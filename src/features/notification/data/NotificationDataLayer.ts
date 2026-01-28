/**
 * Notification Data Layer - Intelligent Data Coordination
 * 
 * Implements the revised architectural pattern where the Data Layer
 * intelligently coordinates between Cache, Repository, and WebSocket layers.
 * Services should only access data through this layer, never directly.
 */

import { Injectable, Inject } from '@/core/di';
import { TYPES } from '@/core/di/types';
import { createCacheProvider, type ICacheProvider } from '@/core/cache';
import { INotificationRepository, NotificationQuery, NotificationFilters, NotificationSettings, NotificationPreferences, PushNotificationStatus, PushSubscription, DeviceToken, QuietHours } from '@features/notification/domain/entities/INotificationRepository';
import { NotificationPage, NotificationResponse, NotificationType } from '@features/notification/data/models/notification';
import { JwtToken } from '@/shared/api/models/common';
import { NOTIFICATION_CACHE_KEYS, NOTIFICATION_CACHE_TTL, NOTIFICATION_CACHE_INVALIDATION } from '../cache/NotificationCacheKeys';

export interface INotificationDataLayer {
  // Core notification operations
  getUserNotifications(userId: string, query: Partial<NotificationQuery>, token: JwtToken): Promise<NotificationPage>;
  getNotificationsByType(userId: string, type: NotificationType, query: Partial<NotificationQuery>, token: JwtToken): Promise<NotificationPage>;
  getUnreadCount(userId: string, token: JwtToken): Promise<number>;
  
  // Notification management
  markAsRead(notificationId: string, userId: string, token: JwtToken): Promise<void>;
  markAllAsRead(userId: string, token: JwtToken): Promise<void>;
  deleteNotification(notificationId: string, userId: string, token: JwtToken): Promise<void>;
  
  // Settings and preferences
  getNotificationSettings(userId: string, token: JwtToken): Promise<NotificationSettings>;
  updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>, token: JwtToken): Promise<NotificationSettings>;
  getNotificationPreferences(userId: string, token: JwtToken): Promise<NotificationPreferences>;
  updateNotificationPreferences(userId: string, preferences: Partial<NotificationPreferences>, token: JwtToken): Promise<NotificationPreferences>;
  
  // Push notification operations
  getPushSubscriptions(userId: string, token: JwtToken): Promise<PushSubscription[]>;
  addPushSubscription(userId: string, subscription: PushSubscription, token: JwtToken): Promise<PushSubscription>;
  removePushSubscription(userId: string, subscriptionId: string, token: JwtToken): Promise<void>;
  
  // Quiet hours
  getQuietHours(userId: string, token: JwtToken): Promise<QuietHours | null>;
  setQuietHours(userId: string, quietHours: QuietHours, token: JwtToken): Promise<QuietHours>;
  
  // Real-time operations
  subscribeToNotificationUpdates(userId: string, callback: (update: any) => void): () => void;
  unsubscribeFromNotificationUpdates(userId: string): void;
}

@Injectable()
export class NotificationDataLayer implements INotificationDataLayer {
  constructor(
    @Inject(TYPES.CACHE_SERVICE) private cache: ICacheProvider,
    @Inject(TYPES.NOTIFICATION_REPOSITORY) private repository: INotificationRepository
  ) {}

  // Core notification operations with intelligent caching
  async getUserNotifications(userId: string, query: Partial<NotificationQuery> = {}, token: JwtToken): Promise<NotificationPage> {
    const page = query.page || 0;
    const size = query.size || 20;
    const cacheKey = NOTIFICATION_CACHE_KEYS.USER_NOTIFICATIONS(userId, page, size);

    // Cache-first lookup with real-time TTL
    let data = this.cache.get<NotificationPage>(cacheKey);
    if (data && this.isDataFresh(data, 'user_notifications')) {
      return data;
    }

    try {
      const fullQuery: NotificationQuery = { userId, page, size, ...query };
      data = await this.repository.getNotifications(fullQuery, token);

      if (data) {
        // Intelligent TTL based on notification count and user activity
        const ttl = this.calculateOptimalTTL(data, 'user_notifications');
        this.cache.set(cacheKey, data, { ttl });
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

    // Cache-first lookup with type-specific TTL
    let data = this.cache.get<NotificationPage>(cacheKey);
    if (data && this.isDataFresh(data, 'notifications_by_type')) {
      return data;
    }

    try {
      const fullQuery: NotificationQuery = { userId, type, page, size, ...query };
      data = await this.repository.getNotifications(fullQuery, token);

      if (data) {
        // Type-specific TTL (different notification types have different freshness requirements)
        const ttl = this.calculateOptimalTTL(data, `notifications_${type}`);
        this.cache.set(cacheKey, data, { ttl });
      }

      return data;
    } catch (error) {
      console.error('Error fetching notifications by type:', error);
      throw error;
    }
  }

  async getUnreadCount(userId: string, token: JwtToken): Promise<number> {
    const cacheKey = NOTIFICATION_CACHE_KEYS.UNREAD_COUNT(userId);

    // Cache-first lookup with short TTL (unread count changes frequently)
    let count = this.cache.get<number>(cacheKey);
    if (count !== undefined && this.isDataFresh({ count, cacheTime: Date.now() }, 'unread_count')) {
      return count;
    }

    try {
      count = await this.repository.getUnreadCount(userId, token);
      
      // Short TTL for unread count (30 seconds)
      this.cache.set(cacheKey, count, { ttl: 30000 });
      
      return count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  // Notification management with intelligent cache updates
  async markAsRead(notificationId: string, userId: string, token: JwtToken): Promise<void> {
    await this.repository.markAsRead(notificationId, userId, token);
    
    // Intelligent cache invalidation
    this.invalidateUserNotificationCaches(userId);
    
    // Update unread count cache
    this.cache.invalidate(NOTIFICATION_CACHE_KEYS.UNREAD_COUNT(userId));
  }

  async markAllAsRead(userId: string, token: JwtToken): Promise<void> {
    await this.repository.markAllAsRead(userId, token);
    
    // Comprehensive cache invalidation
    this.invalidateUserNotificationCaches(userId);
    
    // Update unread count cache
    this.cache.set(NOTIFICATION_CACHE_KEYS.UNREAD_COUNT(userId), 0, { ttl: 30000 });
  }

  async deleteNotification(notificationId: string, userId: string, token: JwtToken): Promise<void> {
    await this.repository.deleteNotification(notificationId, userId, token);
    
    // Intelligent cache invalidation
    this.invalidateUserNotificationCaches(userId);
  }

  // Settings and preferences with longer cache times
  async getNotificationSettings(userId: string, token: JwtToken): Promise<NotificationSettings> {
    const cacheKey = NOTIFICATION_CACHE_KEYS.NOTIFICATION_SETTINGS(userId);

    // Cache-first lookup with long TTL (settings change infrequently)
    let settings = this.cache.get<NotificationSettings>(cacheKey);
    if (settings && this.isDataFresh(settings, 'notification_settings')) {
      return settings;
    }

    try {
      settings = await this.repository.getNotificationSettings(userId, token);
      
      if (settings) {
        // Long TTL for settings (1 hour)
        this.cache.set(cacheKey, settings, { ttl: 3600000 });
      }
      
      return settings;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      throw error;
    }
  }

  async updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>, token: JwtToken): Promise<NotificationSettings> {
    const updatedSettings = await this.repository.updateNotificationSettings(userId, settings, token);
    
    // Update cache with new settings
    const cacheKey = NOTIFICATION_CACHE_KEYS.NOTIFICATION_SETTINGS(userId);
    this.cache.set(cacheKey, updatedSettings, { ttl: 3600000 });
    
    return updatedSettings;
  }

  async getNotificationPreferences(userId: string, token: JwtToken): Promise<NotificationPreferences> {
    const cacheKey = NOTIFICATION_CACHE_KEYS.NOTIFICATION_PREFERENCES(userId);

    // Cache-first lookup with long TTL
    let preferences = this.cache.get<NotificationPreferences>(cacheKey);
    if (preferences && this.isDataFresh(preferences, 'notification_preferences')) {
      return preferences;
    }

    try {
      preferences = await this.repository.getNotificationPreferences(userId, token);
      
      if (preferences) {
        // Long TTL for preferences (1 hour)
        this.cache.set(cacheKey, preferences, { ttl: 3600000 });
      }
      
      return preferences;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      throw error;
    }
  }

  async updateNotificationPreferences(userId: string, preferences: Partial<NotificationPreferences>, token: JwtToken): Promise<NotificationPreferences> {
    const updatedPreferences = await this.repository.updateNotificationPreferences(userId, preferences, token);
    
    // Update cache with new preferences
    const cacheKey = NOTIFICATION_CACHE_KEYS.NOTIFICATION_PREFERENCES(userId);
    this.cache.set(cacheKey, updatedPreferences, { ttl: 3600000 });
    
    return updatedPreferences;
  }

  // Push notification operations
  async getPushSubscriptions(userId: string, token: JwtToken): Promise<PushSubscription[]> {
    const cacheKey = NOTIFICATION_CACHE_KEYS.PUSH_SUBSCRIPTIONS(userId);

    // Cache-first lookup with medium TTL
    let subscriptions = this.cache.get<PushSubscription[]>(cacheKey);
    if (subscriptions && this.isDataFresh(subscriptions, 'push_subscriptions')) {
      return subscriptions;
    }

    try {
      subscriptions = await this.repository.getPushSubscriptions(userId, token);
      
      // Medium TTL for subscriptions (15 minutes)
      this.cache.set(cacheKey, subscriptions, { ttl: 900000 });
      
      return subscriptions;
    } catch (error) {
      console.error('Error fetching push subscriptions:', error);
      throw error;
    }
  }

  async addPushSubscription(userId: string, subscription: PushSubscription, token: JwtToken): Promise<PushSubscription> {
    const result = await this.repository.addPushSubscription(userId, subscription, token);
    
    // Invalidate push subscriptions cache
    this.cache.invalidate(NOTIFICATION_CACHE_KEYS.PUSH_SUBSCRIPTIONS(userId));
    
    return result;
  }

  async removePushSubscription(userId: string, subscriptionId: string, token: JwtToken): Promise<void> {
    await this.repository.removePushSubscription(userId, subscriptionId, token);
    
    // Invalidate push subscriptions cache
    this.cache.invalidate(NOTIFICATION_CACHE_KEYS.PUSH_SUBSCRIPTIONS(userId));
  }

  // Quiet hours operations
  async getQuietHours(userId: string, token: JwtToken): Promise<QuietHours | null> {
    const cacheKey = NOTIFICATION_CACHE_KEYS.QUIET_HOURS(userId);

    // Cache-first lookup with long TTL
    let quietHours = this.cache.get<QuietHours>(cacheKey);
    if (quietHours && this.isDataFresh(quietHours, 'quiet_hours')) {
      return quietHours;
    }

    try {
      quietHours = await this.repository.getQuietHours(userId, token);
      
      if (quietHours) {
        // Long TTL for quiet hours (1 hour)
        this.cache.set(cacheKey, quietHours, { ttl: 3600000 });
      }
      
      return quietHours;
    } catch (error) {
      console.error('Error fetching quiet hours:', error);
      throw error;
    }
  }

  async setQuietHours(userId: string, quietHours: QuietHours, token: JwtToken): Promise<QuietHours> {
    const result = await this.repository.setQuietHours(userId, quietHours, token);
    
    // Update cache with new quiet hours
    const cacheKey = NOTIFICATION_CACHE_KEYS.QUIET_HOURS(userId);
    this.cache.set(cacheKey, result, { ttl: 3600000 });
    
    return result;
  }

  // Real-time operations
  subscribeToNotificationUpdates(userId: string, callback: (update: any) => void): () => void {
    // Set up WebSocket subscription for real-time notification updates
    // This would integrate with the WebSocket service
    console.log(`Subscribing to notification updates for user ${userId}`);
    
    // Return unsubscribe function
    return () => {
      console.log(`Unsubscribing from notification updates for user ${userId}`);
    };
  }

  unsubscribeFromNotificationUpdates(userId: string): void {
    console.log(`Unsubscribing from notification updates for user ${userId}`);
  }

  // Private helper methods for intelligent data coordination

  private isDataFresh(data: any, dataType: string): boolean {
    // Implement intelligent freshness validation based on data type
    const now = Date.now();
    const cacheTime = data.cacheTime || 0;
    
    switch (dataType) {
      case 'user_notifications':
        // User notifications need to be relatively fresh (2 minutes)
        return (now - cacheTime) < 2 * 60 * 1000;
      case 'notifications_by_type':
        // Type-specific notifications can be cached a bit longer (3 minutes)
        return (now - cacheTime) < 3 * 60 * 1000;
      case 'unread_count':
        // Unread count needs to be very fresh (30 seconds)
        return (now - cacheTime) < 30 * 1000;
      case 'notification_settings':
      case 'notification_preferences':
      case 'quiet_hours':
        // Settings can be cached much longer (1 hour)
        return (now - cacheTime) < 60 * 60 * 1000;
      case 'push_subscriptions':
        // Push subscriptions can be cached medium duration (15 minutes)
        return (now - cacheTime) < 15 * 60 * 1000;
      default:
        return (now - cacheTime) < 60 * 1000; // Default 1 minute
    }
  }

  private calculateOptimalTTL(data: any, dataType: string): number {
    // Calculate optimal TTL based on data type and content
    switch (dataType) {
      case 'user_notifications':
        // Base TTL on notification count and activity
        return NOTIFICATION_CACHE_TTL.USER_NOTIFICATIONS;
      case 'notifications_by_type':
        // Different types have different TTL requirements
        return NOTIFICATION_CACHE_TTL.NOTIFICATION_BY_TYPE;
      case 'unread_count':
        return 30000; // 30 seconds
      case 'notification_settings':
      case 'notification_preferences':
      case 'quiet_hours':
        return 3600000; // 1 hour
      case 'push_subscriptions':
        return 900000; // 15 minutes
      default:
        return 60000; // 1 minute
    }
  }

  private invalidateUserNotificationCaches(userId: string): void {
    // Intelligent cache invalidation for user-related notification data
    this.cache.invalidatePattern(NOTIFICATION_CACHE_INVALIDATION.USER_NOTIFICATIONS(userId));
    this.cache.invalidatePattern(NOTIFICATION_CACHE_INVALIDATION.NOTIFICATIONS_BY_TYPE(userId));
  }
}
