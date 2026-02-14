import { NotificationResponse } from "@/features/notification/data/models/notification";
import { getNotificationUtilsService } from '../services/NotificationUtilsService';

/**
 * Legacy exports for backward compatibility
 * 
 * These functions now use the enterprise NotificationUtilsService
 * while maintaining the same API for existing code.
 */

/**
 * Generates a notification text based on notification type.
 *
 * @param {string} type - The type of notification to generate text for.
 * @returns {string} - A descriptive message for given notification type.
 */
export const genNotificationText = (type: string): string => {
    const service = getNotificationUtilsService();
    return service.genNotificationText(type);
};

/**
 * Defines categories for filtering notifications.
 *
 * @typedef {"all" | "requests" | "replies" | "reposts" | "mentions"} Category
 */
export type Category = "all" | "requests" | "replies" | "reposts" | "mentions";

/**
 * Picks appropriate notification filter based on specified category.
 *
 * This function returns a filter function that can be used to filter notifications
 * based on provided category.
 *
 * @param {Category} category - The category of notifications to filter.
 * @returns {Function} - A filter function that returns true for notifications of specified category.
 */
export const pickNotificationFilter = (category: Category) => {
    const service = getNotificationUtilsService();
    return service.pickNotificationFilter(category);
};