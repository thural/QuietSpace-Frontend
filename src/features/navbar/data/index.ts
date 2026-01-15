/**
 * Data layer barrel exports.
 * Provides a clean public API for the data layer.
 */

// Repository implementations
export { NotificationRepository } from "./NotificationRepository";
export { MockNotificationRepository } from "./MockNotificationRepository";

// Repository Factory for dependency injection
export { 
  RepositoryFactory, 
  defaultRepositoryFactory,
  createNotificationRepository,
  createMockNotificationRepository,
  type RepositoryConfig 
} from "./RepositoryFactory";

// Hooks
export { useNotificationData, useNotificationDataWithRepository } from "./useNotificationData";
