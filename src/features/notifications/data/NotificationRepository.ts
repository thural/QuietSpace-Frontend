import 'reflect-metadata';
import { Injectable } from '../../../core/di';
import type { NotificationEntity, NotificationPreferences, NotificationStats } from '../domain';

@Injectable({ lifetime: 'singleton' })
export class NotificationRepository {
  private notifications = new Map<string, NotificationEntity>();
  private preferences = new Map<string, NotificationPreferences>();
  private stats = new Map<string, NotificationStats>();

  // Notification operations
  async createNotification(notification: NotificationEntity): Promise<NotificationEntity> {
    this.notifications.set(notification.id, notification);
    return notification;
  }

  async getNotificationById(id: string): Promise<NotificationEntity | null> {
    return this.notifications.get(id) || null;
  }

  async getNotificationsByUserId(userId: string, options: {
    limit?: number;
    offset?: number;
    unreadOnly?: boolean;
    type?: string;
    priority?: string;
  } = {}): Promise<NotificationEntity[]> {
    const userNotifications = Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .filter(notification => !options.unreadOnly || !notification.read)
      .filter(notification => !options.type || notification.type === options.type)
      .filter(notification => !options.priority || notification.priority === options.priority)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const offset = options.offset || 0;
    const limit = options.limit || 50;
    
    return userNotifications.slice(offset, offset + limit);
  }

  async updateNotification(id: string, updates: Partial<NotificationEntity>): Promise<NotificationEntity> {
    const existing = this.notifications.get(id);
    if (!existing) {
      throw new Error(`Notification ${id} not found`);
    }
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.notifications.set(id, updated);
    return updated;
  }

  async markAsRead(id: string): Promise<NotificationEntity> {
    return this.updateNotification(id, { read: true });
  }

  async markAllAsRead(userId: string): Promise<void> {
    const userNotifications = await this.getNotificationsByUserId(userId);
    const updatePromises = userNotifications
      .filter(notification => !notification.read)
      .map(notification => this.markAsRead(notification.id));
    
    await Promise.all(updatePromises);
  }

  async deleteNotification(id: string): Promise<void> {
    this.notifications.delete(id);
  }

  async deleteExpiredNotifications(): Promise<void> {
    const now = new Date();
    const expiredNotifications = Array.from(this.notifications.values())
      .filter(notification => notification.expiresAt && notification.expiresAt < now);
    
    expiredNotifications.forEach(notification => {
      this.notifications.delete(notification.id);
    });
  }

  // Preferences operations
  async getPreferences(userId: string): Promise<NotificationPreferences | null> {
    return this.preferences.get(userId) || null;
  }

  async updatePreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    const existing = this.preferences.get(userId);
    const updated = existing ? { ...existing, ...preferences } : {
      userId,
      emailNotifications: true,
      pushNotifications: true,
      inAppNotifications: true,
      messageNotifications: true,
      followNotifications: true,
      likeNotifications: true,
      commentNotifications: true,
      mentionNotifications: true,
      systemNotifications: true,
      quietHours: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00'
      },
      frequency: 'immediate' as const,
      ...preferences
    };
    
    this.preferences.set(userId, updated);
    return updated;
  }

  // Stats operations
  async getStats(userId: string): Promise<NotificationStats> {
    const userNotifications = Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId);
    
    const totalNotifications = userNotifications.length;
    const unreadCount = userNotifications.filter(n => !n.read).length;
    const readCount = userNotifications.filter(n => n.read).length;
    
    const notificationsByType = userNotifications.reduce((acc, notification) => {
      acc[notification.type] = (acc[notification.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const notificationsByPriority = userNotifications.reduce((acc, notification) => {
      acc[notification.priority] = (acc[notification.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Calculate average response time (time from creation to read)
    const readNotifications = userNotifications.filter(n => n.read);
    const averageResponseTime = readNotifications.length > 0
      ? readNotifications.reduce((sum, notification) => {
          // This would need a readAt timestamp in real implementation
          return sum + 3600000; // Mock: 1 hour average
        }, 0) / readNotifications.length
      : 0;
    
    const engagementRate = totalNotifications > 0 ? (readCount / totalNotifications) * 100 : 0;
    
    const stats: NotificationStats = {
      totalNotifications,
      unreadCount,
      readCount,
      notificationsByType,
      notificationsByPriority,
      averageResponseTime,
      engagementRate
    };
    
    this.stats.set(userId, stats);
    return stats;
  }

  // Batch operations
  async createBatchNotifications(notifications: NotificationEntity[]): Promise<NotificationEntity[]> {
    const createdNotifications = await Promise.all(
      notifications.map(notification => this.createNotification(notification))
    );
    return createdNotifications;
  }

  async getUnreadCount(userId: string): Promise<number> {
    const userNotifications = Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId && !notification.read);
    return userNotifications.length;
  }

  // Search operations
  async searchNotifications(userId: string, query: string): Promise<NotificationEntity[]> {
    const userNotifications = Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId);
    
    const searchQuery = query.toLowerCase();
    return userNotifications.filter(notification =>
      notification.title.toLowerCase().includes(searchQuery) ||
      notification.message.toLowerCase().includes(searchQuery)
    );
  }
}
