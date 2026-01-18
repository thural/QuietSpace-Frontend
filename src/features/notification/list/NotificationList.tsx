import { NotificationResponse } from "@api/schemas/inferred/notification";
import { NotificationType } from "@/api/schemas/native/notification";
import InfinateScrollContainer from "@shared/InfinateScrollContainer";
import { useGetNotifications } from "@services/data/useNotificationData";
import { Category, pickNotificationFilter } from "@utils/notificationUtils";
import Typography from "@shared/Typography";
import { Center } from "@mantine/core";
import { useParams } from "react-router-dom";
import CommentNotification from "../fragments/CommentNotification";
import FollowNotification from "../fragments/FollowNotification";
import PostNotification from "../fragments/PostNotification";

/**
 * NotificationList component.
 * 
 * This component fetches and displays a list of notifications for the user. 
 * It utilizes infinite scrolling to load more notifications as the user scrolls down.
 * Notifications are filtered based on the selected category from the URL parameters.
 * Each notification is rendered as a specific notification type card (e.g., Comment, Follow).
 * If no notifications are available, a message is displayed to the user.
 * 
 * @returns {JSX.Element} - The rendered NotificationList component displaying notifications.
 */
const NotificationList: React.FC = () => {
    // Retrieve the category from URL parameters
    const params = useParams();
    const category = params.category as Category | undefined;

    // Fetch notifications data with pagination
    const { data: pagedData, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetNotifications();

    // Flatten the paged data to get a single array of notifications
    const content: Array<NotificationResponse> = pagedData.pages.flatMap((page) => page.content);

    // If there are no notifications, display a message
    if (content.length === 0) {
        return (
            <Center>
                <Typography ta="center">You have no Notifications yet</Typography>
            </Center>
        );
    }

    // Apply the selected category filter to the notifications
    const appliedFilter = pickNotificationFilter(category);
    const notifications = content.filter(appliedFilter);

    /**
     * Returns the appropriate notification card based on the notification type.
     * 
     * @param {NotificationResponse} notification - The notification object.
     * @returns {JSX.Element|null} - The rendered notification card or null if no match.
     */
    const getNotificationCard = (notification: NotificationResponse): React.ReactElement | null => {
        const { type, id } = notification;

        // Destructure notification types for easier access
        const {
            FOLLOW_REQUEST,
            POST_REACTION,
            COMMENT,
            COMMENT_REACTION,
            COMMENT_REPLY,
            MENTION,
            REPOST
        } = NotificationType;

        // Determine the correct notification card to render based on the type
        switch (type) {
            case COMMENT_REACTION:
            case COMMENT_REPLY:
                return <CommentNotification key={id} notification={notification} />;
            case FOLLOW_REQUEST:
                return <FollowNotification key={id} notification={notification} />;
            case POST_REACTION:
            case COMMENT:
            case REPOST:
            case MENTION:
                return <PostNotification key={id} notification={notification} />;
            default:
                return null; // Return null if the type does not match any known types
        }
    };

    return (
        <InfinateScrollContainer
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
        >
            {notifications.map(notification => getNotificationCard(notification))}
        </InfinateScrollContainer>
    );
}

export default NotificationList;