/**
 * Public API for the navbar feature.
 * 
 * This file exports the main components and hooks that other parts of the application
 * can use to interact with the navbar feature. It follows the 4-layer architecture
 * pattern with clear separation of concerns.
 */

// Presentation Layer - UI Components
export { Navbar, NavItem, NavMenu } from "./presentation";
export type { NavItemProps } from "./presentation";

// Application Layer - Use Cases/Hooks
export { useNavbar } from "./application";
export type { NavigationItems } from "./application";

// Domain Layer - Business Logic & Entities (for advanced usage/testing)
export {
  isNavigationItemActive,
  hasUnreadMessages,
  hasPendingNotifications,
  isValidNavigationItem,
  createNotificationStatus
} from "./domain";

export type {
  NavigationItemEntity,
  NotificationStatusEntity,
  NavigationMenuEntity,
  NavigationItemsEntity
} from "./domain";
