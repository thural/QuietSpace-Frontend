export interface NotificationEntity {
  id: string;
  userId: string;
  type: 'message' | 'follow' | 'like' | 'comment' | 'mention' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  expiresAt?: Date;
  actionUrl?: string;
  actionText?: string;
}

export interface NotificationPreferences {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  inAppNotifications: boolean;
  messageNotifications: boolean;
  followNotifications: boolean;
  likeNotifications: boolean;
  commentNotifications: boolean;
  mentionNotifications: boolean;
  systemNotifications: boolean;
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
}

export interface NotificationStats {
  totalNotifications: number;
  unreadCount: number;
  readCount: number;
  notificationsByType: Record<string, number>;
  notificationsByPriority: Record<string, number>;
  averageResponseTime: number;
  engagementRate: number;
}
