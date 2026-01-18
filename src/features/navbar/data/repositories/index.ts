/**
 * Data Repository Implementations Barrel Exports.
 */

export { NotificationRepository } from './NotificationRepository';
export { MockNotificationRepository } from './MockNotificationRepository';

// Repository Factory for dependency injection
export { 
  RepositoryFactory, 
  defaultRepositoryFactory,
  createNotificationRepository,
  createMockNotificationRepository,
  type RepositoryConfig 
} from './RepositoryFactory';

// Reactive Repository Pattern
export { 
  ReactiveNotificationRepository,
  useReactiveNotificationRepository,
  createReactiveNotificationRepository
} from './ReactiveNotificationRepository';
