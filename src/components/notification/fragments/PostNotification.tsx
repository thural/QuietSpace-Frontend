import { NotificationItemProps } from "@/types/notificationTypes";
import { genNotificationText } from "@/utils/notificationUtils";
import NotificationCard from "../base/NotificationCard";

const PostNotification: React.FC<NotificationItemProps> = ({ notification, ...props }) => {

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        // TODO: navigate to post page
    };


    return (
        <NotificationCard
            notification={notification}
            onClick={handleClick}
            text={genNotificationText(notification.type)}
            {...props}
        />
    )
}

export default PostNotification