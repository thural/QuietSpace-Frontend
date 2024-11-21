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