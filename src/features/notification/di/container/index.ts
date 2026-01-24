import { Container } from '@/core/di';
import { TYPES } from '@/core/di/types';
import { CacheService } from '@/core/cache/CacheProvider';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { NotificationDataService } from '../services/NotificationDataService';
import { NotificationFeatureService } from '../services/NotificationFeatureService';
import { PushNotificationService } from '../services/PushNotificationService';

/**
 * Notification Feature DI Container
 * 
 * Configures dependency injection for the notification feature following enterprise patterns:
 * - Repositories: Transient scope (stateless data access)
 * - Data Services: Singleton scope (shared cache state)
 * - Feature Services: Singleton scope (business logic)
 * - Push Services: Singleton scope (push notification management)
 * - Cache Service: Singleton scope (shared across features)
 */

export function createNotificationContainer(): Container {
  const container = new Container();
  
  // Core services (inherited from main container)
  // CacheService is registered as singleton in main AppContainer
  
  // Repositories (Transient - new instance per injection)
  container.registerTransientByToken(
    TYPES.NOTIFICATION_REPOSITORY, 
    NotificationRepository
  );
  
  // Data Services (Singleton - shared cache state)
  container.registerSingletonByToken(
    TYPES.NOTIFICATION_DATA_SERVICE, 
    NotificationDataService
  );
  
  // Feature Services (Singleton - business logic)
  container.registerSingletonByToken(
    TYPES.NOTIFICATION_FEATURE_SERVICE, 
    NotificationFeatureService
  );
  
  // Push Notification Services (Singleton - push management)
  container.registerSingletonByToken(
    TYPES.PUSH_NOTIFICATION_SERVICE, 
    PushNotificationService
  );
  
  return container;
}

/**
 * Child container configuration
 * Creates a child container that inherits from the main AppContainer
 */
export function createNotificationChildContainer(parentContainer: Container): Container {
  const notificationContainer = parentContainer.createChild();
  
  // Register notification-specific services
  const notificationSpecificContainer = createNotificationContainer();
  
  // Merge configurations
  notificationContainer.registerTransientByToken(
    TYPES.NOTIFICATION_REPOSITORY, 
    NotificationRepository
  );
  
  notificationContainer.registerSingletonByToken(
    TYPES.NOTIFICATION_DATA_SERVICE, 
    NotificationDataService
  );
  
  notificationContainer.registerSingletonByToken(
    TYPES.NOTIFICATION_FEATURE_SERVICE, 
    NotificationFeatureService
  );
  
  notificationContainer.registerSingletonByToken(
    TYPES.PUSH_NOTIFICATION_SERVICE, 
    PushNotificationService
  );
  
  return notificationContainer;
}

/**
 * Container factory for testing
 */
export function createTestNotificationContainer(): Container {
  const container = new Container();
  
  // Mock implementations can be registered here for testing
  container.registerTransientByToken(
    TYPES.NOTIFICATION_REPOSITORY, 
    NotificationRepository // Replace with mock in tests
  );
  
  container.registerSingletonByToken(
    TYPES.NOTIFICATION_DATA_SERVICE, 
    NotificationDataService
  );
  
  container.registerSingletonByToken(
    TYPES.NOTIFICATION_FEATURE_SERVICE, 
    NotificationFeatureService
  );
  
  container.registerSingletonByToken(
    TYPES.PUSH_NOTIFICATION_SERVICE, 
    PushNotificationService
  );
  
  return container;
}
