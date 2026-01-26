import { Injectable, Inject } from '@/core/di';
import { TYPES } from '@/core/di/types';
import { createCacheProvider, type ICacheProvider } from '@/core/cache';
import { NotificationDataService } from '../services/NotificationDataService';
import { PushSubscription, DeviceToken, DeviceInfo } from '@features/notification/domain/entities/INotificationRepository';
import { JwtToken } from '@/shared/api/models/common';
import { NOTIFICATION_CACHE_KEYS, NOTIFICATION_CACHE_TTL } from '../cache/NotificationCacheKeys';

/**
 * Push Notification Service
 * 
 * Enterprise-grade push notification management with service worker integration,
 * subscription management, and delivery optimization
 */
@Injectable()
export class PushNotificationService {
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
  private vapidPublicKey: string = '';

  constructor(
    @Inject(TYPES.CACHE_SERVICE) private cache: ICacheProvider,
    @Inject(TYPES.NOTIFICATION_DATA_SERVICE) private notificationDataService: NotificationDataService
  ) { }

  // Service Worker Management
  async initializeServiceWorker(): Promise<boolean> {
    try {
      if (!('serviceWorker' in navigator)) {
        console.warn('Service Worker not supported');
        return false;
      }

      this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');

      // Wait for the service worker to be ready
      await navigator.serviceWorker.ready;

      console.log('Service Worker initialized successfully');
      return true;
    } catch (error) {
      console.error('Service Worker initialization failed:', error);
      return false;
    }
  }

  async setVapidPublicKey(publicKey: string): Promise<void> {
    this.vapidPublicKey = publicKey;
    this.cache.set('push:vapid_public_key', publicKey, 24 * 60 * 60 * 1000); // 24 hours
  }

  // Push Subscription Management
  async subscribeToPushNotifications(userId: string, deviceInfo: DeviceInfo, token: JwtToken): Promise<PushSubscription | null> {
    try {
      if (!this.serviceWorkerRegistration) {
        throw new Error('Service Worker not initialized');
      }

      const pushManager = this.serviceWorkerRegistration.pushManager;

      // Check existing subscription
      let subscription = await pushManager.getSubscription();

      if (subscription) {
        // Update existing subscription
        const pushSubscription = this.convertWebPushSubscription(subscription, deviceInfo);
        return await this.notificationDataService.updatePushSubscription(userId, pushSubscription, token);
      }

      // Create new subscription
      subscription = await pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      });

      const pushSubscription = this.convertWebPushSubscription(subscription, deviceInfo);
      return await this.notificationDataService.updatePushSubscription(userId, pushSubscription, token);
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return null;
    }
  }

  async unsubscribeFromPushNotifications(userId: string, token: JwtToken): Promise<boolean> {
    try {
      if (!this.serviceWorkerRegistration) {
        throw new Error('Service Worker not initialized');
      }

      const pushManager = this.serviceWorkerRegistration.pushManager;
      const subscription = await pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
      }

      await this.notificationDataService.removePushSubscription(userId, token);

      console.log('Successfully unsubscribed from push notifications');
      return true;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return false;
    }
  }

  async getPushSubscriptionStatus(userId: string, token: JwtToken): Promise<{
    isSubscribed: boolean;
    subscription: PushSubscription | null;
    permission: NotificationPermission;
  }> {
    try {
      const permission = await Notification.requestPermission();
      const subscription = await this.notificationDataService.getPushSubscription(userId, token);

      return {
        isSubscribed: !!subscription && permission === 'granted',
        subscription,
        permission
      };
    } catch (error) {
      console.error('Error getting push subscription status:', error);
      return {
        isSubscribed: false,
        subscription: null,
        permission: 'default'
      };
    }
  }

  // Push Message Handling
  async handlePushMessage(event: PushEvent): Promise<void> {
    try {
      const data = event.data?.json();

      if (!data) {
        console.warn('Push message received without data');
        return;
      }

      // Cache the push message for offline access
      await this.cachePushMessage(data);

      // Show notification if user is not active
      if (!this.isUserActive()) {
        await this.showPushNotification(data);
      }

      // Update badge count
      await this.updateBadgeCount(data.userId);

      // Trigger event for app to handle
      this.dispatchPushEvent(data);
    } catch (error) {
      console.error('Error handling push message:', error);
    }
  }

  // Notification Display
  private async showPushNotification(data: any): Promise<void> {
    try {
      const options: NotificationOptions = {
        body: data.body || 'You have a new notification',
        icon: data.icon || '/icons/icon-192x192.png',
        badge: data.badge || '/icons/badge-72x72.png',
        tag: data.tag || 'default',
        data: data,
        requireInteraction: data.requireInteraction || false,
        silent: data.silent || false,
        actions: data.actions || [
          {
            action: 'view',
            title: 'View',
            icon: '/icons/view.png'
          },
          {
            action: 'dismiss',
            title: 'Dismiss',
            icon: '/icons/dismiss.png'
          }
        ]
      };

      if (data.image) {
        options.image = data.image;
      }

      const notification = new Notification(data.title || 'New Notification', options);

      // Handle notification click
      notification.onclick = (event) => {
        event.preventDefault();
        this.handleNotificationClick(data, notification);
      };

      // Auto-dismiss after 5 seconds if not required interaction
      if (!options.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }
    } catch (error) {
      console.error('Error showing push notification:', error);
    }
  }

  private handleNotificationClick(data: any, notification: Notification): void {
    // Close the notification
    notification.close();

    // Focus or open the app
    if (window.focus) {
      window.focus();
    } else {
      window.open(window.location.href, '_blank');
    }

    // Navigate to the relevant page
    if (data.url) {
      window.location.href = data.url;
    }

    // Mark notification as read
    if (data.notificationId) {
      this.markNotificationAsRead(data.notificationId);
    }
  }

  // Badge Management
  private async updateBadgeCount(userId: string): Promise<void> {
    try {
      // This would require a token, which we don't have in this context
      // In a real implementation, you'd get the token from secure storage
      const unreadCount = await this.getUnreadCountFromCache(userId);

      if ('setAppBadge' in navigator) {
        if (unreadCount > 0) {
          await navigator.setAppBadge(unreadCount);
        } else {
          await navigator.clearAppBadge();
        }
      }
    } catch (error) {
      console.error('Error updating badge count:', error);
    }
  }

  // Device Management
  async registerDevice(userId: string, deviceInfo: DeviceInfo, token: JwtToken): Promise<DeviceToken | null> {
    try {
      const deviceToken = await this.notificationDataService.registerDevice(userId, deviceInfo, token);

      // Cache device info for offline access
      const cacheKey = NOTIFICATION_CACHE_KEYS.DEVICE_TOKENS(userId);
      this.cache.set(cacheKey, [deviceToken], NOTIFICATION_CACHE_TTL.DEVICE_TOKENS);

      return deviceToken;
    } catch (error) {
      console.error('Error registering device:', error);
      return null;
    }
  }

  async unregisterDevice(userId: string, deviceId: string, token: JwtToken): Promise<boolean> {
    try {
      await this.notificationDataService.removeDeviceToken(userId, deviceId, token);

      // Remove from cache
      const cacheKey = NOTIFICATION_CACHE_KEYS.DEVICE_TOKENS(userId);
      this.cache.delete(cacheKey);

      return true;
    } catch (error) {
      console.error('Error unregistering device:', error);
      return false;
    }
  }

  // Quiet Hours and Do Not Disturb
  async checkQuietHours(userId: string, token: JwtToken): Promise<boolean> {
    try {
      const quietHours = await this.notificationDataService.getQuietHours(userId, token);

      if (!quietHours?.enabled) {
        return false;
      }

      return this.isInQuietHours(quietHours);
    } catch (error) {
      console.error('Error checking quiet hours:', error);
      return false;
    }
  }

  // Analytics and Monitoring
  async trackNotificationDelivery(notificationId: string, status: 'delivered' | 'failed' | 'clicked'): Promise<void> {
    try {
      const analyticsKey = `notification:analytics:${notificationId}`;
      const existing = this.cache.get(analyticsKey) || {};

      const updated = {
        ...existing,
        [status]: (existing[status] || 0) + 1,
        lastUpdated: new Date().toISOString()
      };

      this.cache.set(analyticsKey, updated, 24 * 60 * 60 * 1000); // 24 hours
    } catch (error) {
      console.error('Error tracking notification delivery:', error);
    }
  }

  async getNotificationAnalytics(notificationId: string): Promise<any> {
    try {
      const analyticsKey = `notification:analytics:${notificationId}`;
      return this.cache.get(analyticsKey) || {};
    } catch (error) {
      console.error('Error getting notification analytics:', error);
      return {};
    }
  }

  // Utility Methods
  private convertWebPushSubscription(subscription: PushSubscription, deviceInfo: DeviceInfo): PushSubscription {
    return {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.toJSON().keys!.p256dh,
        auth: subscription.toJSON().keys!.auth
      },
      deviceInfo,
      createdAt: new Date(),
      isActive: true
    };
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  private isUserActive(): boolean {
    // Check if user is actively using the app
    const lastActivity = this.cache.get('user:last_activity');
    if (!lastActivity) return false;

    const timeSinceActivity = Date.now() - new Date(lastActivity).getTime();
    return timeSinceActivity < 5 * 60 * 1000; // 5 minutes
  }

  private async cachePushMessage(data: any): Promise<void> {
    try {
      const cacheKey = `push:message:${data.id}`;
      this.cache.set(cacheKey, data, 24 * 60 * 60 * 1000); // 24 hours
    } catch (error) {
      console.error('Error caching push message:', error);
    }
  }

  private dispatchPushEvent(data: any): void {
    const event = new CustomEvent('pushMessage', { detail: data });
    window.dispatchEvent(event);
  }

  private async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      // This would require a token and user ID
      // In a real implementation, you'd get these from secure storage
      const event = new CustomEvent('markNotificationAsRead', { detail: { notificationId } });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  private async getUnreadCountFromCache(userId: string): Promise<number> {
    try {
      const cacheKey = NOTIFICATION_CACHE_KEYS.UNREAD_COUNT(userId);
      return this.cache.get(cacheKey) || 0;
    } catch (error) {
      console.error('Error getting unread count from cache:', error);
      return 0;
    }
  }

  private isInQuietHours(quietHours: any): boolean {
    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 5); // HH:mm format

    const currentMinutes = this.timeToMinutes(currentTime);
    const startMinutes = this.timeToMinutes(quietHours.startTime);
    const endMinutes = this.timeToMinutes(quietHours.endTime);

    if (startMinutes <= endMinutes) {
      return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    } else {
      return currentMinutes >= startMinutes || currentMinutes < endMinutes;
    }
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Public API for React components
  async requestNotificationPermission(): Promise<NotificationPermission> {
    try {
      return await Notification.requestPermission();
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'default';
    }
  }

  isNotificationSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  }

  getNotificationPermission(): NotificationPermission {
    return Notification.permission;
  }
}
