import * as React from 'react';
import { useService } from "@core/di";
import type { NotificationEntity, NotificationPreferences, NotificationStats } from '../../domain/entities/NotificationEntity';
import { NotificationRepositoryDI } from '../../data/repositories/NotificationRepositoryDI';

// Simple service class without decorators for now
export class NotificationServiceDI {
  private notificationRepository: NotificationRepositoryDI;

  constructor() {
    this.notificationRepository = useService(NotificationRepositoryDI);
  }

  // Notification management
  async createNotification(data: Omit<NotificationEntity, 'id' | 'createdAt'>): Promise<NotificationEntity> {
    const notification: NotificationEntity = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    return await this.notificationRepository.createNotification(notification);
  }

  async getNotification(id: string): Promise<NotificationEntity | null> {
    return await this.notificationRepository.getNotificationById(id);
  }

  async getUserNotifications(userId: string, options: {
    limit?: number;
    offset?: number;
    unreadOnly?: boolean;
    type?: string;
    priority?: string;
  } = {}): Promise<NotificationEntity[]> {
    return await this.notificationRepository.getNotificationsByUserId(userId, options);
  }

  async markAsRead(id: string): Promise<NotificationEntity> {
    return await this.notificationRepository.markAsRead(id);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.markAllAsRead(userId);
  }

  async deleteNotification(id: string): Promise<void> {
    await this.notificationRepository.deleteNotification(id);
  }

  // Preferences management
  async getPreferences(userId: string): Promise<NotificationPreferences | null> {
    return await this.notificationRepository.getPreferences(userId);
  }

  async updatePreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    return await this.notificationRepository.updatePreferences(userId, preferences);
  }

  // Analytics
  async getStats(userId: string): Promise<NotificationStats> {
    return await this.notificationRepository.getStats(userId);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await this.notificationRepository.getUnreadCount(userId);
  }

  // Advanced notification creation
  async createMessageNotification(userId: string, messageData: {
    senderId: string;
    senderName: string;
    messageContent: string;
    conversationId: string;
  }): Promise<NotificationEntity> {
    return await this.createNotification({
      userId,
      type: 'message',
      title: `New message from ${messageData.senderName}`,
      message: messageData.messageContent.substring(0, 100) + (messageData.messageContent.length > 100 ? '...' : ''),
      data: {
        senderId: messageData.senderId,
        conversationId: messageData.conversationId
      },
      read: false,
      priority: 'medium',
      actionUrl: `/messages/${messageData.conversationId}`,
      actionText: 'View Message'
    });
  }

  async createFollowNotification(userId: string, followerData: {
    followerId: string;
    followerName: string;
    followerAvatar?: string;
  }): Promise<NotificationEntity> {
    return await this.createNotification({
      userId,
      type: 'follow',
      title: `${followerData.followerName} started following you`,
      message: `Check out ${followerData.followerName}'s profile`,
      data: {
        followerId: followerData.followerId,
        followerAvatar: followerData.followerAvatar
      },
      read: false,
      priority: 'low',
      actionUrl: `/profile/${followerData.followerId}`,
      actionText: 'View Profile'
    });
  }

  async createLikeNotification(userId: string, likeData: {
    likerId: string;
    likerName: string;
    postId: string;
    postContent: string;
  }): Promise<NotificationEntity> {
    return await this.createNotification({
      userId,
      type: 'like',
      title: `${likeData.likerName} liked your post`,
      message: likeData.postContent.substring(0, 100) + (likeData.postContent.length > 100 ? '...' : ''),
      data: {
        likerId: likeData.likerId,
        postId: likeData.postId
      },
      read: false,
      priority: 'low',
      actionUrl: `/post/${likeData.postId}`,
      actionText: 'View Post'
    });
  }

  async createCommentNotification(userId: string, commentData: {
    commenterId: string;
    commenterName: string;
    postId: string;
    postContent: string;
    commentContent: string;
  }): Promise<NotificationEntity> {
    return await this.createNotification({
      userId,
      type: 'comment',
      title: `${commentData.commenterName} commented on your post`,
      message: commentData.commentContent.substring(0, 100) + (commentData.commentContent.length > 100 ? '...' : ''),
      data: {
        commenterId: commentData.commenterId,
        postId: commentData.postId
      },
      read: false,
      priority: 'medium',
      actionUrl: `/post/${commentData.postId}`,
      actionText: 'View Comment'
    });
  }

  async createMentionNotification(userId: string, mentionData: {
    mentionerId: string;
    mentionerName: string;
    postId?: string;
    commentId?: string;
    content: string;
  }): Promise<NotificationEntity> {
    const actionUrl = mentionData.postId
      ? `/post/${mentionData.postId}`
      : `/comment/${mentionData.commentId}`;

    return await this.createNotification({
      userId,
      type: 'mention',
      title: `${mentionData.mentionerName} mentioned you`,
      message: mentionData.content.substring(0, 100) + (mentionData.content.length > 100 ? '...' : ''),
      data: {
        mentionerId: mentionData.mentionerId,
        postId: mentionData.postId,
        commentId: mentionData.commentId
      },
      read: false,
      priority: 'medium',
      actionUrl,
      actionText: 'View Mention'
    });
  }

  async createSystemNotification(userId: string, systemData: {
    title: string;
    message: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    actionUrl?: string;
    actionText?: string;
  }): Promise<NotificationEntity> {
    return await this.createNotification({
      userId,
      type: 'system',
      title: systemData.title,
      message: systemData.message,
      data: {},
      read: false,
      priority: systemData.priority || 'medium',
      actionUrl: systemData.actionUrl,
      actionText: systemData.actionText
    });
  }

  // Batch operations
  async createBatchNotifications(notifications: Array<{
    userId: string;
    type: NotificationEntity['type'];
    title: string;
    message: string;
    data?: Record<string, any>;
    priority?: NotificationEntity['priority'];
    actionUrl?: string;
    actionText?: string;
  }>): Promise<NotificationEntity[]> {
    const notificationEntities: NotificationEntity[] = notifications.map(notification => ({
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      read: false,
      priority: notification.priority || 'medium'
    }));

    return await this.notificationRepository.createBatchNotifications(notificationEntities);
  }

  // Search and filtering
  async searchNotifications(userId: string, query: string): Promise<NotificationEntity[]> {
    return await this.notificationRepository.searchNotifications(userId, query);
  }

  // Cleanup operations
  async cleanupExpiredNotifications(): Promise<void> {
    await this.notificationRepository.deleteExpiredNotifications();
  }

  // Real-time notification simulation
  async simulateRealTimeNotification(userId: string, type: NotificationEntity['type']): Promise<NotificationEntity> {
    const notificationData = {
      message: {
        senderId: 'user1',
        senderName: 'John Doe',
        messageContent: 'Hey, how are you doing?',
        conversationId: 'conv1'
      },
      follow: {
        followerId: 'user2',
        followerName: 'Jane Smith',
        followerAvatar: 'avatar2.jpg'
      },
      like: {
        likerId: 'user3',
        likerName: 'Bob Johnson',
        postId: 'post1',
        postContent: 'Great weather today!'
      },
      comment: {
        commenterId: 'user4',
        commenterName: 'Alice Brown',
        postId: 'post2',
        postContent: 'Amazing sunset photo',
        commentContent: 'Beautiful colors!'
      },
      mention: {
        mentionerId: 'user5',
        mentionerName: 'Charlie Wilson',
        postId: 'post3',
        content: '@username check this out!'
      },
      system: {
        title: 'System Update',
        message: 'New features have been added to the platform',
        priority: 'medium' as const,
        actionUrl: '/updates',
        actionText: 'Learn More'
      }
    };

    switch (type) {
      case 'message':
        return await this.createMessageNotification(userId, notificationData.message);
      case 'follow':
        return await this.createFollowNotification(userId, notificationData.follow);
      case 'like':
        return await this.createLikeNotification(userId, notificationData.like);
      case 'comment':
        return await this.createCommentNotification(userId, notificationData.comment);
      case 'mention':
        return await this.createMentionNotification(userId, notificationData.mention);
      case 'system':
        return await this.createSystemNotification(userId, notificationData.system);
      default:
        throw new Error(`Unknown notification type: ${type}`);
    }
  }
}

// DI-enabled Hook
export const useNotificationsDI = (userId: string) => {
  const notificationService = useService(NotificationServiceDI);
  const [notifications, setNotifications] = React.useState<NotificationEntity[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch notifications
  const fetchNotifications = React.useCallback(async (options: {
    limit?: number;
    offset?: number;
    unreadOnly?: boolean;
    type?: string;
    priority?: string;
  } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const data = await notificationService.getUserNotifications(userId, options);
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [notificationService, userId]);

  // Fetch unread count
  const fetchUnreadCount = React.useCallback(async () => {
    try {
      const count = await notificationService.getUnreadCount(userId);
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  }, [notificationService, userId]);

  // Mark as read
  const markAsRead = React.useCallback(async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as read');
    }
  }, [notificationService]);

  // Mark all as read
  const markAllAsRead = React.useCallback(async () => {
    try {
      await notificationService.markAllAsRead(userId);
      setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
      setUnreadCount(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all as read');
    }
  }, [notificationService, userId]);

  // Delete notification
  const deleteNotification = React.useCallback(async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      const deletedNotification = notifications.find(n => n.id === id);
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete notification');
    }
  }, [notificationService, notifications]);

  // Create notification
  const createNotification = React.useCallback(async (data: Omit<NotificationEntity, 'id' | 'createdAt'>) => {
    try {
      const notification = await notificationService.createNotification(data);
      setNotifications(prev => [notification, ...prev]);
      if (!notification.read) {
        setUnreadCount(prev => prev + 1);
      }
      return notification;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create notification');
      throw err;
    }
  }, [notificationService]);

  // Simulate real-time notification
  const simulateNotification = React.useCallback(async (type: NotificationEntity['type']) => {
    try {
      const notification = await notificationService.simulateRealTimeNotification(userId, type);
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      return notification;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to simulate notification');
      throw err;
    }
  }, [notificationService, userId]);

  // Initial fetch
  React.useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    simulateNotification
  };
};
