/**
 * NotificationItem Component Interfaces
 */

import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { ReactNode } from 'react';

/**
 * Notification Type
 */
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'follow' | 'mention' | 'comment' | 'like';

/**
 * Notification Priority
 */
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Notification Author
 */
export interface INotificationAuthor {
  name: string;
  username?: string;
  avatar?: string;
}

/**
 * Notification Action
 */
export interface INotificationAction {
  id: string;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

/**
 * NotificationItem Props
 */
export interface INotificationItemProps extends IBaseComponentProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read?: boolean;
  priority?: NotificationPriority;
  author?: INotificationAuthor;
  metadata?: Record<string, any>;
  actions?: INotificationAction[];
  onClick?: () => void;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
  className?: string;
}

/**
 * NotificationItem State
 */
export interface INotificationItemState extends IBaseComponentState {
  isHovered: boolean;
  isExpanded: boolean;
}
