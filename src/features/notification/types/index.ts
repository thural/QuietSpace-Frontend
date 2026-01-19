/**
 * Notification Feature Types.
 * 
 * Shared types and interfaces used across the notification feature.
 */

// Re-export domain entities
export type { 
  NotificationEntity, 
  NotificationPreferences, 
  NotificationStats 
} from '../domain/entities/NotificationEntity';

// Re-export domain entities
export type { 
  NotificationQuery, 
  NotificationFilters, 
  NotificationResult,
  NotificationMessage,
  NotificationSettings,
  NotificationParticipant,
  NotificationTypingIndicator,
  NotificationEvent,
  NotificationStatus
} from '../domain/entities/NotificationEntities';

// Re-export API types
export type { 
  NotificationPage, 
  NotificationResponse, 
  NotificationType 
} from '@api/schemas/inferred/notification';

export type { 
  ResId, 
  JwtToken 
} from '@api/schemas/inferred/common';

// Component prop types
export interface NotificationCenterProps {
  userId: string;
  className?: string;
  maxNotifications?: number;
  showBadge?: boolean;
  enableSimulation?: boolean;
  onNotificationClick?: (notification: NotificationResponse) => void;
  onMarkAsRead?: (notificationId: ResId) => void;
  onDelete?: (notificationId: ResId) => void;
}

export interface NotificationItemProps {
  notification: NotificationResponse;
  onMarkAsRead?: (notificationId: ResId) => void;
  onDelete?: (notificationId: ResId) => void;
  onClick?: (notification: NotificationResponse) => void;
  className?: string;
  compact?: boolean;
}

export interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  className?: string;
  showZero?: boolean;
}

export interface NotificationFilterProps {
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export interface NotificationSimulatorProps {
  onSimulate: (type: NotificationType, count?: number) => void;
  availableTypes: NotificationType[];
  className?: string;
  disabled?: boolean;
}

// Hook configuration types
export interface UseNotificationConfig {
  userId: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  maxRetries?: number;
  enableRealtime?: boolean;
}

export interface UseAdvancedNotificationConfig extends UseNotificationConfig {
  useOptimisticUpdates?: boolean;
  enableWebSocket?: boolean;
  conflictResolution?: 'client' | 'server' | 'manual';
  maxCacheSize?: number;
}

export interface UseReactQueryNotificationConfig extends UseNotificationConfig {
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
}

// Event types
export interface NotificationClickEvent {
  notification: NotificationResponse;
  timestamp: Date;
  source: 'click' | 'keyboard' | 'touch';
}

export interface NotificationReadEvent {
  notificationId: ResId;
  timestamp: Date;
  previouslyRead: boolean;
}

export interface NotificationDeleteEvent {
  notificationId: ResId;
  timestamp: Date;
  confirmed: boolean;
}

// Utility types
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';
export type NotificationFilterType = 'all' | 'unread' | 'read' | 'message' | 'follow' | 'like' | 'comment' | 'mention' | 'system';

// Validation types
export interface NotificationValidationRule {
  field: keyof NotificationResponse;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => string | null;
}

export interface NotificationValidationError {
  field: string;
  message: string;
  value: any;
}

// Theme types
export interface NotificationTheme {
  primary?: string;
  background?: string;
  text?: string;
  border?: string;
  shadow?: string;
  priorityColors?: Record<NotificationPriority, string>;
}

export interface NotificationStyles {
  container?: React.CSSProperties;
  header?: React.CSSProperties;
  content?: React.CSSProperties;
  item?: React.CSSProperties;
  badge?: React.CSSProperties;
  button?: React.CSSProperties;
}

// Default values
export const DEFAULT_NOTIFICATION_CONFIG: UseNotificationConfig = {
  userId: '', // Required field
  autoRefresh: false,
  refreshInterval: 30000, // 30 seconds
  maxRetries: 3,
  enableRealtime: true,
};

export const DEFAULT_ADVANCED_CONFIG: UseAdvancedNotificationConfig = {
  ...DEFAULT_NOTIFICATION_CONFIG,
  useOptimisticUpdates: true,
  enableWebSocket: true,
  conflictResolution: 'client',
  maxCacheSize: 100,
};

export const DEFAULT_REACT_QUERY_CONFIG: UseReactQueryNotificationConfig = {
  ...DEFAULT_NOTIFICATION_CONFIG,
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
};
