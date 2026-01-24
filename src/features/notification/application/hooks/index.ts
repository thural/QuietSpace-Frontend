/**
 * Notification Application Hooks Barrel Export.
 * 
 * Exports all hooks from the application layer.
 */

// Legacy Notification Hooks (for backward compatibility)
export { default as useNotifications } from './useNotifications';
export { default as useAdvancedNotifications } from './useAdvancedNotifications';
export { default as usePushNotifications } from './usePushNotifications';
export { default as useNotificationSettings } from './useNotificationSettings';
export { default as useNotificationSocket } from './useNotificationSocket';
// useReactQueryNotifications removed - migrated to enterprise hooks
export { default as useWasSeen } from './useWasSeen';

// Enterprise Notification Hooks (new - recommended for use)
export { useEnterpriseNotifications } from './useEnterpriseNotifications';

// Migration Hook (for gradual transition)
export { useNotificationMigration, NotificationMigrationUtils } from './useNotificationMigration';

// Enterprise Services Hook
export { useNotificationServices } from './useNotificationServices';

// Re-export commonly used types and utilities
export type { 
  NotificationPage, 
  NotificationResponse, 
  NotificationType,
  NotificationQuery,
  NotificationFilters 
} from '@/features/notification/data/models/notification';
export type { 
  NotificationSettings,
  NotificationPreferences,
  PushNotificationStatus,
  QuietHours 
} from '../../domain/entities/INotificationRepository';
export type { ResId } from '@/shared/api/models/common';
