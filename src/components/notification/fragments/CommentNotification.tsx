import { NotificationItemProps } from "@/types/notificationTypes";
import { genNotificationText } from "@/utils/notificationUtils";
import NotificationCard from "../base/NotificationCard";



const CommentNotification: React.FC<NotificationItemProps> = ({ notification, ...props }) => {

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        // TODO: navigate to post page
    };

    return (
        <NotificationCard
            {...props}
            notification={notification}
            onClick={handleClick}
            text={genNotificationText(notification.type)}
        />
    );
};

export default CommentNotification;