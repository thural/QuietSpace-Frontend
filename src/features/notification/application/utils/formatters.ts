/**
 * Notification Formatters.
 * 
 * Utility functions for formatting notification data.
 */

import type { NotificationResponse } from '@/features/notification/data/models/notification';

/**
 * Format relative time (e.g., "2 hours ago", "just now")
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
};

/**
 * Format notification priority for display
 */
export const formatPriority = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'urgent':
      return '🔴 Urgent';
    case 'high':
      return '🟠 High';
    case 'medium':
      return '🟡 Medium';
    case 'low':
      return '🔵 Low';
    default:
      return priority;
  }
};

/**
 * Format notification type with icon
 */
export const formatNotificationType = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'message':
      return '💬 Message';
    case 'follow':
      return '👤 Follow';
    case 'like':
      return '❤️ Like';
    case 'comment':
      return '💬 Comment';
    case 'mention':
      return '🏷️ Mention';
    case 'system':
      return '⚙️ System';
    default:
      return type;
  }
};

/**
 * Truncate text to specified length with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Format notification title with proper capitalization
 */
export const formatTitle = (title: string): string => {
  if (!title) return '';

  return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
};

/**
 * Format notification count with proper pluralization
 */
export const formatNotificationCount = (count: number): string => {
  if (count === 0) return 'No notifications';
  if (count === 1) return '1 notification';
  return `${count} notifications`;
};

/**
 * Get notification color based on type and priority
 */
export const getNotificationColor = (type: string, priority?: string): string => {
  const priorityColors = {
    urgent: '#dc3545',
    high: '#fd7e14',
    medium: '#ffc107',
    low: '#28a745'
  };

  const typeColors = {
    message: '#007bff',
    follow: '#28a745',
    like: '#e83e8c',
    comment: '#6c757d',
    mention: '#6610f2',
    system: '#6c757d'
  };

  if (priority && priorityColors[priority as keyof typeof priorityColors]) {
    return priorityColors[priority as keyof typeof priorityColors];
  }

  return typeColors[type as keyof typeof typeColors] || '#6c757d';
};

/**
 * Check if notification is recent (within last 24 hours)
 */
export const isRecentNotification = (date: Date): boolean => {
  const twentyFourHoursAgo = new Date(Date.now() - (24 * 60 * 60 * 1000));
  return date > twentyFourHoursAgo;
};

/**
 * Format notification preview text
 */
export const formatNotificationPreview = (message: string, maxLength: number = 100): string => {
  return truncateText(message.replace(/\n/g, ' '), maxLength);
};

/**
 * Get notification duration in milliseconds
 */
export const getNotificationDuration = (createdAt: Date): number => {
  return Date.now() - createdAt.getTime();
};
