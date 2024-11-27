import { NotificationResponse } from "@/api/schemas/inferred/notification";
import { NotificationType } from "@/api/schemas/native/notification";

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
            return "commented your post";
        case REPOST:
            return "reposted your post";
        case COMMENT_REPLY:
            return "replied your comment";
        case COMMENT_REACTION:
            return "reacted your comment";
        case MENTION:
            return "mentioned you";
        default:
            return "invalid notification type"
    }

};


export type Category = "all" | "requests" | "replies" | "reposts" | "mentions";

const noFilter = () => true;
const repostFilter = (n: NotificationResponse) => n.type === NotificationType.REPOST;
const mentionFilter = (n: NotificationResponse) => n.type === NotificationType.MENTION;
const requestFilter = (n: NotificationResponse) => n.type === NotificationType.FOLLOW_REQUEST;
const replyFilter = (n: NotificationResponse) => n.type === NotificationType.COMMENT_REPLY || n.type === NotificationType.COMMENT;

export const pickNotificationFilter = (category: Category) => {
    switch (category) {
        case "all": return noFilter;
        case "replies": return replyFilter;
        case "reposts": return repostFilter;
        case "requests": return requestFilter;
        case "mentions": return mentionFilter;
    }
};