import { NotificationType } from "@/api/schemas/native/notification";
import NotificationCard from "./base/NotificationCard";
import { NotificationItemProps } from "@/types/notificationTypes";
import { getEnumValueFromString } from "@/utils/enumUtils";

const PostNotification: React.FC<NotificationItemProps> = ({ notification, ...props }) => {

    const { type } = notification;
    const enumValue = getEnumValueFromString(NotificationType, type);

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        // TODO: navigate to post page
    };

    const { POST_REACTION, COMMENT, REPOST } = NotificationType

    const getTextContent = () => {
        switch (enumValue) {
            case POST_REACTION:
                return "reacted to your post";
            case COMMENT:
                return "commented your post";
            case REPOST:
                return "reposted your post";
            default:
                return "mentioned you";
        }
    }


    return (
        <NotificationCard notification={notification} onClick={handleClick} text={getTextContent()} {...props} />
    )
}

export default PostNotification