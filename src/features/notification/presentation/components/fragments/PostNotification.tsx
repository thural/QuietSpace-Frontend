import { NotificationItemProps } from "../../../types/notificationTypes";
import { genNotificationText } from "@/shared/utils/notificationUtils";
import NotificationCard from "../NotificationCard";

/**
 * PostNotification component.
 * 
 * This component represents a notification related to posts, such as likes or comments.
 * It generates a user-friendly text message based on the notification type and handles 
 * click events to navigate to the corresponding post page.
 * 
 * @param {NotificationItemProps} props - The component props.
 * @param {Object} props.notification - The notification data object containing details about the post event.
 * @returns {JSX.Element} - The rendered PostNotification component displaying the notification card.
 */
const PostNotification: React.FC<NotificationItemProps> = ({ notification, ...props }) => {

    /**
     * Handles click events on the notification card.
     * 
     * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event - The click event.
     */
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
    );
}

export default PostNotification;