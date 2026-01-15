/**
 * Domain layer barrel exports.
 * Provides a clean public API for the domain layer.
 */

// Entities
export type {
  NavigationItemEntity,
  NotificationStatusEntity,
  NavigationMenuEntity,
  NavigationItemsEntity
} from "./entities";

// Business logic
export {
  isNavigationItemActive,
  hasUnreadMessages,
  hasPendingNotifications,
  isValidNavigationItem,
  createNotificationStatus
} from "./navigationLogic";
