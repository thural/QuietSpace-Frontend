import { NotificationResponse } from "@/api/schemas/inferred/notification";
import { NotificationType } from "@/api/schemas/native/notification";

/**
 * Generates a notification text based on the notification type.
 *
 * This function takes a notification type as a string and returns a corresponding
 * message that describes the action associated with that notification type.
 *
 * @param {string} type - The type of notification to generate text for.
 * @returns {string} - A descriptive message for the given notification type.
 */
export const genNotificationText = (type: string) => {
    const {
        COMMENT_REACTION,
        COMMENT_REPLY,
        POST_REACTION,
        COMMENT,
        REPOST,
        MENTION
    } = NotificationType;

    switch (type) {
        case POST_REACTION:
            return "reacted to your post";
        case COMMENT:
            return "commented on your post";
        case REPOST:
            return "reposted your post";
        case COMMENT_REPLY:
            return "replied to your comment";
        case COMMENT_REACTION:
            return "reacted to your comment";
        case MENTION:
            return "mentioned you";
        default:
            return "invalid notification type";
    }
};

/**
 * Defines the categories for filtering notifications.
 *
 * This type can be used to specify which category of notifications to filter.
 * 
 * @typedef {"all" | "requests" | "replies" | "reposts" | "mentions"} Category
 */

const noFilter = () => true;

/**
 * Filter function for repost notifications.
 *
 * This function checks if the notification type is a repost.
 *
 * @param {NotificationResponse} n - The notification response object to check.
 * @returns {boolean} - Returns true if the notification type is a repost; otherwise, false.
 */
const repostFilter = (n: NotificationResponse) => n.type === NotificationType.REPOST;

/**
 * Filter function for mention notifications.
 *
 * This function checks if the notification type is a mention.
 *
 * @param {NotificationResponse} n - The notification response object to check.
 * @returns {boolean} - Returns true if the notification type is a mention; otherwise, false.
 */
const mentionFilter = (n: NotificationResponse) => n.type === NotificationType.MENTION;

/**
 * Filter function for follow request notifications.
 *
 * This function checks if the notification type is a follow request.
 *
 * @param {NotificationResponse} n - The notification response object to check.
 * @returns {boolean} - Returns true if the notification type is a follow request; otherwise, false.
 */
const requestFilter = (n: NotificationResponse) => n.type === NotificationType.FOLLOW_REQUEST;

/**
 * Filter function for reply notifications.
 *
 * This function checks if the notification type is a comment reply or comment.
 *
 * @param {NotificationResponse} n - The notification response object to check.
 * @returns {boolean} - Returns true if the notification type is a comment reply or comment; otherwise, false.
 */
const replyFilter = (n: NotificationResponse) =>
    n.type === NotificationType.COMMENT_REPLY || n.type === NotificationType.COMMENT;

/**
 * Picks the appropriate notification filter based on the specified category.
 *
 * This function returns a filter function that can be used to filter notifications
 * based on the provided category.
 *
 * @param {Category} category - The category of notifications to filter.
 * @returns {Function} - A filter function that returns true for notifications of the specified category.
 */
export type Category = "all" | "requests" | "replies" | "reposts" | "mentions";
export const pickNotificationFilter = (category: Category) => {
    switch (category) {
        case "all": return noFilter;
        case "replies": return replyFilter;
        case "reposts": return repostFilter;
        case "requests": return requestFilter;
        case "mentions": return mentionFilter;
    }
};