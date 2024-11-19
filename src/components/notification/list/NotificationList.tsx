import { Notification } from "@/api/schemas/inferred/notification";
import { NotificationType } from "@/api/schemas/native/notification";
import { NotificationListProps } from "@/types/notificationTypes";
import Typography from "@components/shared/Typography";
import CommentNotification from "../fragments/CommentNotification";
import FollowNotification from "../fragments/FollowNotification";
import PostNotification from "../fragments/PostNotification";



const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => {

    if (!notifications.length) return <Typography ta="center">You have no Notifications yet</Typography>

    const getNotificationCard = (notification: Notification) => {
        const { type, id } = notification;
        // const enumValue = getEnumValueFromString(NotificationType, type)

        const {
            FOLLOW_REQUEST,
            POST_REACTION,
            COMMENT,
            COMMENT_REACTION,
            COMMENT_REPLY,
            MENTION,
            REPOST
        } = NotificationType;

        switch (type) {

            case COMMENT_REACTION:
                return <CommentNotification key={id} notification={notification} />;
            case COMMENT_REPLY:
                return <CommentNotification key={id} notification={notification} />;
            case FOLLOW_REQUEST:
                return <FollowNotification key={id} notification={notification} />;
            case POST_REACTION:
                return <PostNotification key={id} notification={notification} />;
            case COMMENT:
                return <PostNotification key={id} notification={notification} />;
            case REPOST:
                return <PostNotification key={id} notification={notification} />;
            case MENTION:
                return <PostNotification key={id} notification={notification} />;
            default: return null;
        }
    }

    return notifications.map(notification => getNotificationCard(notification));
}

export default NotificationList