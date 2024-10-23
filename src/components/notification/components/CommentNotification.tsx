import { NotificationType } from "@/api/schemas/notification";
import NotificationCard from "./base/NotificationCard";
import { getEnumValueFromString } from "@/utils/enumUtils";
import { NotificationItemProps } from "@/types/notificationTypes";



const CommentNotification: React.FC<NotificationItemProps> = ({ notification, ...props }) => {
    const { type } = notification;
    const enumValue = getEnumValueFromString(NotificationType, type);
    const { COMMENT_REACTION, COMMENT_REPLY } = NotificationType;

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        // TODO: navigate to post page
    };

    const getTextContent = () => {
        if (enumValue === COMMENT_REACTION)
            return "reacted your comment";
        if (enumValue === COMMENT_REPLY)
            return "replied your comment";
        else return "invalid notification type"
    };

    return (
        <NotificationCard
            {...props}
            notification={notification}
            onClick={handleClick}
            text={getTextContent()}
        />
    );
};

export default CommentNotification;