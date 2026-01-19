import FollowToggle from "@shared/FollowToggle";
import { useGetUserById } from "@services/data/useUserData";
import { NotificationItemProps } from "@shared-types/notificationTypes";
import { useNavigate } from "react-router-dom";
import NotificationCard from "../NotificationCard";
import NotificationSkeleton from "@shared/NotificationSkeleton";

/**
 * FollowNotification component.
 * 
 * This component represents a notification indicating that a user has been followed.
 * It retrieves user data based on the actor ID associated with the notification. 
 * When clicked, it navigates to the user's profile page. If the user data is still loading, 
 * a skeleton loader is displayed.
 * 
 * @param {NotificationItemProps} props - The component props.
 * @param {Object} props.notification - The notification data object containing details about the follow event.
 * @returns {JSX.Element} - The rendered FollowNotification component displaying the notification card.
 */
const FollowNotification: React.FC<NotificationItemProps> = ({ notification }) => {
    const navigate = useNavigate();
    const { actorId } = notification;
    const { data: user, isLoading } = useGetUserById(actorId);

    /**
     * Handles click events on the notification card.
     * 
     * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event - The click event.
     */
    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        navigate(`/profile/${actorId}`);
    };

    // Return a loading skeleton if the user data is still being fetched
    if (isLoading || user === undefined) return <NotificationSkeleton />;

    return (
        <NotificationCard notification={notification} onClick={handleClick} text={"followed you"}>
            <FollowToggle user={user} />
        </NotificationCard>
    );
}

export default FollowNotification;