import { useDIContainer } from '@/core/di';
import { TYPES } from '@/core/di/types';
import { NotificationDataService } from '@features/notification/data/services/NotificationDataService';
import { NotificationFeatureService } from '@features/notification/application/services/NotificationFeatureService';
import { PushNotificationService } from '@features/notification/application/services/PushNotificationService';

/**
 * Notification Services Hook
 * 
 * Provides access to notification data and feature services through dependency injection
 * Follows the established pattern from auth and chat features for consistency
 */
export const useNotificationServices = () => {
  const container = useDIContainer();
  
  // Get services from DI container
  const notificationDataService = container.get<NotificationDataService>(TYPES.NOTIFICATION_DATA_SERVICE);
  const notificationFeatureService = container.get<NotificationFeatureService>(TYPES.NOTIFICATION_FEATURE_SERVICE);
  const pushNotificationService = container.get<PushNotificationService>(TYPES.PUSH_NOTIFICATION_SERVICE);
  
  return {
    // Data service for caching and data orchestration
    notificationDataService,
    
    // Feature service for business logic and validation
    notificationFeatureService,
    
    // Push service for push notification management
    pushNotificationService,
    
    // Convenience methods for common operations
    data: notificationDataService,
    feature: notificationFeatureService,
    push: pushNotificationService
  };
};
