/**
 * Notification Data Barrel Export.
 * 
 * Exports all data layer components.
 */

// Repository implementations
export { NotificationRepository } from './repositories/NotificationRepository';
export { MockNotificationRepository } from './repositories/MockNotificationRepository';

// DI-specific repository
export { NotificationRepositoryDI } from './repositories/NotificationRepositoryDI';

// Data services (Enterprise)
export { NotificationDataService } from './services/NotificationDataService';

// Cache exports (Enterprise)
export { NOTIFICATION_CACHE_KEYS, NOTIFICATION_CACHE_TTL, NOTIFICATION_CACHE_INVALIDATION, NotificationCacheUtils } from './cache/NotificationCacheKeys';

// Types and interfaces (Enterprise)
export type { 
  NotificationQuery,
  NotificationFilters,
  NotificationSettings,
  NotificationPreferences,
  PushNotificationStatus,
  PushSubscription,
  DeviceToken,
  DeviceInfo,
  QuietHours,
  QuietHoursException
} from '../domain/entities/INotificationRepository';

// Public API - Cross-feature data hooks
export * from './useNotificationData';
