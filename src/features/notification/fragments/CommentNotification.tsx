import { NotificationItemProps } from "@/types/notificationTypes";
import { genNotificationText } from "@/utils/notificationUtils";
import NotificationCard from "../base/NotificationCard";

/**
 * CommentNotification component.
 * 
 * This component represents a notification specifically for comments.
 * It formats the notification text based on the notification type and handles
 * click events to navigate to the corresponding post page.
 * 
 * @param {NotificationItemProps} props - The component props.
 * @param {Object} props.notification - The notification data object containing details about the comment.
 * @returns {JSX.Element} - The rendered CommentNotification component displaying the notification card.
 */
const CommentNotification: React.FC<NotificationItemProps> = ({ notification, ...props }) => {

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
            {...props}
            notification={notification}
            onClick={handleClick}
            text={genNotificationText(notification.type)}
        />
    );
};

export default CommentNotification;