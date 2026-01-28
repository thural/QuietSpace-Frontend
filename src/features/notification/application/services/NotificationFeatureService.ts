import { Injectable, Inject } from '@/core/di';
import { TYPES } from '@/core/di/types';
import { NotificationDataLayer } from '../../data/NotificationDataLayer';
import { NotificationPage, NotificationResponse, NotificationType } from '@features/notification/data/models/notification';
import { JwtToken } from '@/shared/api/models/common';
import { NOTIFICATION_CACHE_KEYS } from '../cache/NotificationCacheKeys';

/**
 * Notification Feature Service
 * 
 * Implements business logic and orchestration for notification features
 * Provides validation, push notification management, and cross-service coordination
 */
@Injectable()
export class NotificationFeatureService {
  constructor(
    @Inject(TYPES.NOTIFICATION_DATA_SERVICE) private notificationDataLayer: NotificationDataLayer
  ) { }

  // Notification business logic
  async getUserNotifications(userId: string, query: Partial<NotificationQuery> = {}, token: JwtToken): Promise<NotificationPage> {
    // Pre-query validation
    await this.validateNotificationQuery(userId, query);

    try {
      const result = await this.notificationDataLayer.getUserNotifications(userId, query, token);

      // Post-processing business logic
      await this.processNotificationResults(result, userId);

      return result;
    } catch (error) {
      console.error('Error in getUserNotifications:', error);
      throw error;
    }
  }

  async getUnreadCount(userId: string, token: JwtToken): Promise<number> {
    try {
      const count = await this.notificationDataLayer.getUnreadCount(userId, token);

      // Business logic: respect quiet hours for count updates
      const quietHours = await this.notificationDataLayer.getQuietHours(userId, token);
      if (quietHours?.enabled && this.isInQuietHours(quietHours)) {
        console.log('User is in quiet hours, notification count may be delayed');
      }

      return count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  async markAsRead(notificationId: string, userId: string, token: JwtToken): Promise<NotificationResponse> {
    // Pre-action validation
    await this.validateNotificationAccess(notificationId, userId, token);

    try {
      const result = await this.notificationDataLayer.markAsRead(notificationId, token);

      // Post-action business logic
      await this.handleNotificationRead(result, userId);

      return result;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markMultipleAsRead(notificationIds: string[], userId: string, token: JwtToken): Promise<NotificationResponse[]> {
    // Pre-action validation
    await this.validateMultipleNotificationAccess(notificationIds, userId, token);

    try {
      const results = await this.notificationDataLayer.markMultipleAsRead(notificationIds, token);

      // Post-action business logic
      await this.handleMultipleNotificationsRead(results, userId);

      return results;
    } catch (error) {
      console.error('Error marking multiple notifications as read:', error);
      throw error;
    }
  }

  // Search and filtering business logic
  async searchNotifications(userId: string, searchQuery: string, filters?: NotificationFilters, token: JwtToken): Promise<NotificationPage> {
    // Pre-search validation
    await this.validateSearchQuery(searchQuery);

    try {
      const result = await this.notificationDataLayer.searchNotifications(userId, searchQuery, filters, token);

      // Post-search processing
      await this.processSearchResults(result, userId);

      return result;
    } catch (error) {
      console.error('Error searching notifications:', error);
      throw error;
    }
  }

  // Notification settings business logic
  async updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>, token: JwtToken): Promise<NotificationSettings> {
    // Pre-update validation
    await this.validateNotificationSettings(settings);

    try {
      const result = await this.notificationDataLayer.updateNotificationSettings(userId, settings, token);

      // Post-update business logic
      await this.handleSettingsUpdate(result, userId);

      return result;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  }

  // Push notification business logic
  async enablePushNotifications(userId: string, subscription: PushSubscription, token: JwtToken): Promise<PushNotificationStatus> {
    // Pre-enablement validation
    await this.validatePushSubscription(subscription);

    try {
      // Update subscription
      await this.notificationDataLayer.updatePushSubscription(userId, subscription, token);

      // Update push status
      const statusUpdate = {
        enabled: true,
        subscribed: true,
        lastSyncAt: new Date(),
        deviceCount: 1,
        activeDevices: 1
      };

      const result = await this.notificationDataLayer.updatePushNotificationStatus(userId, statusUpdate, token);

      // Post-enablement business logic
      await this.handlePushNotificationEnabled(result, userId);

      return result;
    } catch (error) {
      console.error('Error enabling push notifications:', error);
      throw error;
    }
  }

  async disablePushNotifications(userId: string, token: JwtToken): Promise<void> {
    try {
      // Remove subscription
      await this.notificationDataLayer.removePushSubscription(userId, token);

      // Update push status
      const statusUpdate = {
        enabled: false,
        subscribed: false,
        deviceCount: 0,
        activeDevices: 0
      };

      await this.notificationDataLayer.updatePushNotificationStatus(userId, statusUpdate, token);

      // Post-disablement business logic
      await this.handlePushNotificationDisabled(userId);
    } catch (error) {
      console.error('Error disabling push notifications:', error);
      throw error;
    }
  }

  async registerDevice(userId: string, deviceInfo: DeviceInfo, token: JwtToken): Promise<DeviceToken> {
    // Pre-registration validation
    await this.validateDeviceInfo(deviceInfo);

    try {
      const deviceToken: Omit<DeviceToken, 'id' | 'createdAt' | 'lastUsedAt'> = {
        token: this.generateDeviceToken(deviceInfo),
        platform: deviceInfo.platform as 'ios' | 'android' | 'web',
        deviceInfo,
        isActive: true
      };

      const result = await this.notificationDataLayer.registerDeviceToken(userId, deviceToken, token);

      // Post-registration business logic
      await this.handleDeviceRegistered(result, userId);

      return result;
    } catch (error) {
      console.error('Error registering device:', error);
      throw error;
    }
  }

  async removeDevice(userId: string, deviceId: string, token: JwtToken): Promise<void> {
    // Pre-removal validation
    await this.validateDeviceRemoval(deviceId, userId);

    try {
      await this.notificationDataLayer.removeDeviceToken(userId, deviceId, token);

      // Post-removal business logic
      await this.handleDeviceRemoved(deviceId, userId);
    } catch (error) {
      console.error('Error removing device:', error);
      throw error;
    }
  }

  // Quiet hours business logic
  async updateQuietHours(userId: string, quietHours: QuietHours, token: JwtToken): Promise<QuietHours> {
    // Pre-update validation
    await this.validateQuietHours(quietHours);

    try {
      const result = await this.notificationDataLayer.updateQuietHours(userId, quietHours, token);

      // Post-update business logic
      await this.handleQuietHoursUpdate(result, userId);

      return result;
    } catch (error) {
      console.error('Error updating quiet hours:', error);
      throw error;
    }
  }

  async shouldDeliverNotification(userId: string, notificationType: NotificationType, token: JwtToken): Promise<boolean> {
    try {
      // Check quiet hours
      const quietHours = await this.notificationDataLayer.getQuietHours(userId, token);
      if (quietHours?.enabled && this.isInQuietHours(quietHours)) {
        return false;
      }

      // Check user preferences
      const preferences = await this.notificationDataLayer.getNotificationPreferences(userId, token);
      if (preferences && !preferences[notificationType]?.enabled) {
        return false;
      }

      // Check rate limiting
      const rateLimitKey = NOTIFICATION_CACHE_KEYS.RATE_LIMIT(userId, 'notification_delivery');
      const rateLimitResult = await this.checkRateLimit(userId, 'notification_delivery');
      if (!rateLimitResult.allowed) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking notification delivery:', error);
      return true; // Default to delivering on error
    }
  }

  // Private helper methods
  private async validateNotificationQuery(userId: string, query: Partial<NotificationQuery>): Promise<void> {
    if (!userId || typeof userId !== 'string') {
      throw new Error('Valid user ID is required');
    }

    if (query.page !== undefined && (query.page < 0 || !Number.isInteger(query.page))) {
      throw new Error('Page must be a non-negative integer');
    }

    if (query.size !== undefined && (query.size < 1 || query.size > 100)) {
      throw new Error('Size must be between 1 and 100');
    }
  }

  private async validateNotificationAccess(notificationId: string, userId: string, token: JwtToken): Promise<void> {
    if (!notificationId || !userId) {
      throw new Error('Notification ID and user ID are required');
    }

    // Verify user owns the notification
    const notification = await this.notificationDataLayer.getNotificationById(notificationId, token);
    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.recipientId !== userId) {
      throw new Error('Access denied: User does not own this notification');
    }
  }

  private async validateMultipleNotificationAccess(notificationIds: string[], userId: string, token: JwtToken): Promise<void> {
    if (!notificationIds || notificationIds.length === 0) {
      throw new Error('At least one notification ID is required');
    }

    if (notificationIds.length > 100) {
      throw new Error('Cannot mark more than 100 notifications at once');
    }

    // Verify access to all notifications
    for (const id of notificationIds) {
      await this.validateNotificationAccess(id, userId, token);
    }
  }

  private async validateSearchQuery(searchQuery: string): Promise<void> {
    if (!searchQuery || typeof searchQuery !== 'string') {
      throw new Error('Search query is required');
    }

    if (searchQuery.length < 2) {
      throw new Error('Search query must be at least 2 characters long');
    }

    if (searchQuery.length > 100) {
      throw new Error('Search query must be less than 100 characters');
    }
  }

  private async validateNotificationSettings(settings: Partial<NotificationSettings>): Promise<void> {
    if (settings.maxDailyNotifications !== undefined && settings.maxDailyNotifications < 0) {
      throw new Error('Max daily notifications cannot be negative');
    }

    if (settings.quietHours) {
      await this.validateQuietHours(settings.quietHours);
    }
  }

  private async validatePushSubscription(subscription: PushSubscription): Promise<void> {
    if (!subscription.endpoint) {
      throw new Error('Push subscription endpoint is required');
    }

    if (!subscription.keys || !subscription.keys.p256dh || !subscription.keys.auth) {
      throw new Error('Push subscription keys are required');
    }

    if (!subscription.deviceInfo) {
      throw new Error('Device information is required');
    }
  }

  private async validateDeviceInfo(deviceInfo: DeviceInfo): Promise<void> {
    if (!deviceInfo.platform || !deviceInfo.userAgent) {
      throw new Error('Platform and user agent are required');
    }

    if (!['ios', 'android', 'web'].includes(deviceInfo.platform.toLowerCase())) {
      throw new Error('Invalid platform. Must be ios, android, or web');
    }
  }

  private async validateDeviceRemoval(deviceId: string, userId: string): Promise<void> {
    if (!deviceId || !userId) {
      throw new Error('Device ID and user ID are required');
    }
  }

  private async validateQuietHours(quietHours: QuietHours): Promise<void> {
    if (!quietHours.startTime || !quietHours.endTime) {
      throw new Error('Start and end times are required');
    }

    if (!quietHours.timezone) {
      throw new Error('Timezone is required');
    }

    // Validate time format (HH:mm)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(quietHours.startTime) || !timeRegex.test(quietHours.endTime)) {
      throw new Error('Time must be in HH:mm format');
    }
  }

  private async processNotificationResults(result: NotificationPage, userId: string): Promise<void> {
    // Sort notifications by priority and date
    result.notifications.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 2;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 2;

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
    });
  }

  private async processSearchResults(result: NotificationPage, userId: string): Promise<void> {
    // Highlight search terms in results
    // This would be implemented based on search requirements
  }

  private async handleNotificationRead(notification: NotificationResponse, userId: string): Promise<void> {
    // Invalidate unread count cache
    this.notificationDataLayer.invalidateRealtimeCaches(userId);

    // Log notification read event
    console.log(`Notification ${notification.id} marked as read by user ${userId}`);
  }

  private async handleMultipleNotificationsRead(notifications: NotificationResponse[], userId: string): Promise<void> {
    // Invalidate unread count cache
    this.notificationDataLayer.invalidateRealtimeCaches(userId);

    // Log batch read event
    console.log(`${notifications.length} notifications marked as read by user ${userId}`);
  }

  private async handleSettingsUpdate(settings: NotificationSettings, userId: string): Promise<void> {
    // Invalidate settings cache
    this.notificationDataLayer.invalidateAllUserCaches(userId);

    // Log settings update
    console.log(`Notification settings updated for user ${userId}`);
  }

  private async handlePushNotificationEnabled(status: PushNotificationStatus, userId: string): Promise<void> {
    // Invalidate push-related caches
    this.notificationDataLayer.invalidateRealtimeCaches(userId);

    // Log push notification enabled
    console.log(`Push notifications enabled for user ${userId}`);
  }

  private async handlePushNotificationDisabled(userId: string): Promise<void> {
    // Invalidate push-related caches
    this.notificationDataLayer.invalidateRealtimeCaches(userId);

    // Log push notification disabled
    console.log(`Push notifications disabled for user ${userId}`);
  }

  private async handleDeviceRegistered(device: DeviceToken, userId: string): Promise<void> {
    // Invalidate device cache
    this.notificationDataLayer.invalidateAllUserCaches(userId);

    // Log device registration
    console.log(`Device ${device.id} registered for user ${userId}`);
  }

  private async handleDeviceRemoved(deviceId: string, userId: string): Promise<void> {
    // Invalidate device cache
    this.notificationDataLayer.invalidateAllUserCaches(userId);

    // Log device removal
    console.log(`Device ${deviceId} removed for user ${userId}`);
  }

  private async handleQuietHoursUpdate(quietHours: QuietHours, userId: string): Promise<void> {
    // Invalidate settings cache
    this.notificationDataLayer.invalidateAllUserCaches(userId);

    // Log quiet hours update
    console.log(`Quiet hours updated for user ${userId}`);
  }

  private isInQuietHours(quietHours: QuietHours): boolean {
    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 5); // HH:mm format

    // Check for exceptions
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const exception = quietHours.exceptions?.find(ex => ex.date === today && ex.enabled);

    if (exception) {
      // Use exception times if available, otherwise quiet hours are disabled
      if (exception.startTime && exception.endTime) {
        return this.isTimeInRange(currentTime, exception.startTime, exception.endTime);
      }
      return false;
    }

    return this.isTimeInRange(currentTime, quietHours.startTime, quietHours.endTime);
  }

  private isTimeInRange(current: string, start: string, end: string): boolean {
    const currentMinutes = this.timeToMinutes(current);
    const startMinutes = this.timeToMinutes(start);
    const endMinutes = this.timeToMinutes(end);

    if (startMinutes <= endMinutes) {
      // Same day range (e.g., 22:00 to 07:00)
      return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    } else {
      // Overnight range (e.g., 22:00 to 07:00)
      return currentMinutes >= startMinutes || currentMinutes < endMinutes;
    }
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private generateDeviceToken(deviceInfo: DeviceInfo): string {
    // Generate a unique device token based on device info
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `${deviceInfo.platform}_${timestamp}_${random}`;
  }

  private async checkRateLimit(userId: string, action: string): Promise<{ allowed: boolean; remaining: number; resetTime: Date }> {
    // This would integrate with a rate limiting service
    // For now, return a default response
    return {
      allowed: true,
      remaining: 100,
      resetTime: new Date(Date.now() + 60000)
    };
  }
}
