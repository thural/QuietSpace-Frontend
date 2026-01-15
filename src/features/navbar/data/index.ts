/**

// Repository implementations
export { NotificationRepository } from "./NotificationRepository";
export { MockNotificationRepository } from "./MockNotificationRepository";

// Hook (legacy - will be refactored to use repository pattern)
export { useNotificationData } from "./useNotificationData";
 * Data layer barrel exports.
 * Provides a clean public API for the data layer.
 */

export { useNotificationData } from "./useNotificationData";
