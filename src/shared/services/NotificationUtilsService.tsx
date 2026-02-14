/**
 * Enterprise Notification Utils Service
 * 
 * A standalone service that replaces notificationUtils functions
 * with enterprise patterns for notification management and formatting.
 */

import { NotificationResponse } from "../../features/notification/data/models/notification";
import { NotificationType } from "../../features/notification/data/models/notificationNative";

// Re-export NotificationType for backward compatibility
export { NotificationType };

// Notification utils service interface
export interface INotificationUtilsService {
    genNotificationText(type: string): string;
    pickNotificationFilter(category: Category): (n: NotificationResponse) => boolean;
    getAllNotificationTypes(): string[];
    getNotificationCategories(): Category[];
    createNotificationFilter(type: NotificationType): (n: NotificationResponse) => boolean;
    destroy(): void;
}

/**
 * Defines categories for filtering notifications.
 * 
 * @typedef {"all" | "requests" | "replies" | "reposts" | "mentions"} Category
 */
export type Category = "all" | "requests" | "replies" | "reposts" | "mentions";

/**
 * NotificationUtilsService - Enterprise service for notification utilities
 * 
 * Provides centralized notification management with text generation,
 * filtering capabilities, and category management.
 */
class NotificationUtilsService implements INotificationUtilsService {
    private notificationSubscriptions: Map<string, { callback: (data: any) => void; id: string }> = new Map();
    private subscriptionIdCounter: number = 0;
    private isDestroyed: boolean = false;
    private lastGeneratedText: string = '';
    private lastFilterCategory: Category = 'all';

    constructor() {
        // No initialization needed for standalone service
    }

    /**
     * Generates a notification text based on notification type.
     *
     * This function takes a notification type as a string and returns a corresponding
     * message that describes action associated with that notification type.
     *
     * @param type - The type of notification to generate text for.
     * @returns A descriptive message for given notification type.
     */
    public genNotificationText = (type: string): string => {
        const {
            COMMENT_REACTION,
            COMMENT_REPLY,
            POST_REACTION,
            COMMENT,
            REPOST,
            MENTION
        } = NotificationType;

        let generatedText: string;

        switch (type) {
            case POST_REACTION:
                generatedText = "reacted to your post";
                break;
            case COMMENT:
                generatedText = "commented your post";
                break;
            case REPOST:
                generatedText = "reposted your post";
                break;
            case COMMENT_REPLY:
                generatedText = "replied your comment";
                break;
            case COMMENT_REACTION:
                generatedText = "reacted your comment";
                break;
            case MENTION:
                generatedText = "mentioned you";
                break;
            default:
                generatedText = "invalid notification type";
                break;
        }

        // Update state
        this.lastGeneratedText = generatedText;
        this.notifySubscribers({ type: 'textGenerated', data: generatedText });

        return generatedText;
    };

    /**
     * Filter function for repost notifications.
     *
     * This function checks if notification type is a repost.
     *
     * @param n - The notification response object to check.
     * @returns Returns true if notification type is a repost; otherwise, false.
     */
    private repostFilter = (n: NotificationResponse): boolean => {
        return n.type === NotificationType.REPOST;
    };

    /**
     * Filter function for mention notifications.
     *
     * This function checks if notification type is a mention.
     *
     * @param n - The notification response object to check.
     * @returns Returns true if notification type is a mention; otherwise, false.
     */
    private mentionFilter = (n: NotificationResponse): boolean => {
        return n.type === NotificationType.MENTION;
    };

    /**
     * Filter function for follow request notifications.
     *
     * This function checks if notification type is a follow request.
     *
     * @param n - The notification response object to check.
     * @returns Returns true if notification type is a follow request; otherwise, false.
     */
    private requestFilter = (n: NotificationResponse): boolean => {
        return n.type === NotificationType.FOLLOW_REQUEST;
    };

    /**
     * Filter function for reply notifications.
     *
     * This function checks if notification type is a comment reply or comment.
     *
     * @param n - The notification response object to check.
     * @returns Returns true if notification type is a comment reply or comment; otherwise, false.
     */
    private replyFilter = (n: NotificationResponse): boolean => {
        return n.type === NotificationType.COMMENT_REPLY || n.type === NotificationType.COMMENT;
    };

    /**
     * No filter function - returns true for all notifications
     */
    private noFilter = (): ((n: NotificationResponse) => boolean) => {
        return () => true;
    };

    /**
     * Picks appropriate notification filter based on specified category.
     *
     * This function returns a filter function that can be used to filter notifications
     * based on provided category.
     *
     * @param category - The category of notifications to filter.
     * @returns A filter function that returns true for notifications of specified category.
     */
    public pickNotificationFilter = (category: Category): ((n: NotificationResponse) => boolean) => {
        // Update state
        this.lastFilterCategory = category;
        this.notifySubscribers({ type: 'filterChanged', data: category });

        switch (category) {
            case "all":
                return this.noFilter();
            case "replies":
                return this.replyFilter;
            case "reposts":
                return this.repostFilter;
            case "requests":
                return this.requestFilter;
            case "mentions":
                return this.mentionFilter;
            default:
                return this.noFilter();
        }
    };

    /**
     * Creates a notification filter for a specific notification type
     *
     * @param type - The notification type to filter for
     * @returns Filter function for the specified type
     */
    public createNotificationFilter = (type: NotificationType): ((n: NotificationResponse) => boolean) => {
        return (n: NotificationResponse): boolean => n.type === type;
    };

    /**
     * Gets all available notification types
     *
     * @returns Array of all notification type constants
     */
    public getAllNotificationTypes = (): string[] => {
        return Object.values(NotificationType);
    };

    /**
     * Gets all available notification categories
     *
     * @returns Array of all notification categories
     */
    public getNotificationCategories = (): Category[] => {
        return ["all", "requests", "replies", "reposts", "mentions"];
    };

    /**
     * Validates if a notification type is valid
     *
     * @param type - The notification type to validate
     * @returns True if valid, false otherwise
     */
    public isValidNotificationType = (type: string): boolean => {
        return Object.values(NotificationType).includes(type as NotificationType);
    };

    /**
     * Validates if a category is valid
     *
     * @param category - The category to validate
     * @returns True if valid, false otherwise
     */
    public isValidCategory = (category: string): category is Category => {
        const validCategories: Category[] = ["all", "requests", "replies", "reposts", "mentions"];
        return validCategories.includes(category as Category);
    };

    /**
     * Gets notification type display name
     *
     * @param type - The notification type
     * @returns Human-readable display name
     */
    public getNotificationTypeDisplayName = (type: NotificationType): string => {
        const displayNames: Record<NotificationType, string> = {
            [NotificationType.COMMENT_REACTION]: "Comment Reaction",
            [NotificationType.COMMENT_REPLY]: "Comment Reply",
            [NotificationType.POST_REACTION]: "Post Reaction",
            [NotificationType.COMMENT]: "Comment",
            [NotificationType.REPOST]: "Repost",
            [NotificationType.MENTION]: "Mention",
            [NotificationType.FOLLOW_REQUEST]: "Follow Request"
        };

        return displayNames[type] || "Unknown";
    };

    /**
     * Gets category display name
     *
     * @param category - The category
     * @returns Human-readable display name
     */
    public getCategoryDisplayName = (category: Category): string => {
        const displayNames: Record<Category, string> = {
            all: "All Notifications",
            requests: "Follow Requests",
            replies: "Comments & Replies",
            reposts: "Reposts",
            mentions: "Mentions"
        };

        return displayNames[category] || "Unknown";
    };

    /**
     * Subscribe to notification utils events
     */
    public subscribe = (callback: (data: { type: string; data: any }) => void): (() => void) => {
        if (this.isDestroyed) {
            return () => { };
        }

        const id = `notification_utils_subscription_${++this.subscriptionIdCounter}`;
        const subscription = { callback, id };

        this.notificationSubscriptions.set(id, subscription);

        // Return unsubscribe function
        return () => {
            this.notificationSubscriptions.delete(id);
        };
    };

    /**
     * Notify all subscribers of events
     */
    private notifySubscribers = (data: { type: string; data: any }): void => {
        if (this.isDestroyed) return;

        this.notificationSubscriptions.forEach(subscription => {
            try {
                subscription.callback(data);
            } catch (error) {
                console.error('Error in notification utils subscription callback:', error);
            }
        });
    };

    /**
     * Get subscription count
     */
    public getSubscriptionCount = (): number => {
        return this.notificationSubscriptions.size;
    };

    /**
     * Check if service is active
     */
    public isActive = (): boolean => {
        return !this.isDestroyed;
    };

    /**
     * Get last generated text
     */
    public getLastGeneratedText = (): string => {
        return this.lastGeneratedText;
    };

    /**
     * Get last filter category
     */
    public getLastFilterCategory = (): Category => {
        return this.lastFilterCategory;
    };

    /**
     * Destroy service and clean up all resources
     */
    public destroy = (): void => {
        if (this.isDestroyed) return;

        this.isDestroyed = true;
        this.notificationSubscriptions.clear();
    };
}

// Singleton instance for application-wide use
let notificationUtilsServiceInstance: NotificationUtilsService | null = null;

/**
 * Factory function to get or create NotificationUtilsService singleton
 */
export const getNotificationUtilsService = (): NotificationUtilsService => {
    if (!notificationUtilsServiceInstance) {
        notificationUtilsServiceInstance = new NotificationUtilsService();
    }
    return notificationUtilsServiceInstance;
};

/**
 * Factory function to create a new NotificationUtilsService instance
 */
export const createNotificationUtilsService = (): NotificationUtilsService => {
    return new NotificationUtilsService();
};

/**
 * Legacy exports for backward compatibility
 */
export const genNotificationText = (type: string): string => {
    const service = getNotificationUtilsService();
    return service.genNotificationText(type);
};

export const pickNotificationFilter = (category: Category): ((n: NotificationResponse) => boolean) => {
    const service = getNotificationUtilsService();
    return service.pickNotificationFilter(category);
};

export default NotificationUtilsService;
