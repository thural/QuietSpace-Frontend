import styles from "@/styles/notification/notificationCardStyles";
import { useEffect } from "react";

import UserCard from "@shared/UserCard";
import useWasSeen from "@services/hook/common/useWasSeen";
import { useNotificationStore } from "@services/store/zustand";
import { NotificationCardProps } from "@shared-types/notificationTypes";
import FlexStyled from "@shared/FlexStyled";
import Typography from "@shared/Typography";

/**
 * NotificationCard component.
 * 
 * This component displays a notification card with information about the notification's actor and message.
 * It also manages the notification's "seen" state, updating it when the notification is interacted with.
 * 
 * @param {NotificationCardProps} props - The component props.
 * @param {Object} props.notification - The notification data object.
 * @param {Function} props.onClick - Callback function to handle click events on the notification card.
 * @param {React.ReactNode} props.children - Optional children to render within the notification card.
 * @param {string} props.text - The message text of the notification.
 * @returns {JSX.Element} - The rendered NotificationCard component containing user and notification details.
 */
const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onClick, children, text }) => {
    const classes = styles();

    const [wasSeen, wasSeenRef] = useWasSeen();
    const { id, actorId } = notification;
    const { clientMethods } = useNotificationStore();
    const { isClientConnected, setNotificationSeen } = clientMethods;

    /**
     * Handles marking the notification as seen.
     * This function checks the connection status and the current state of the notification
     * before marking it as seen.
     */
    const handleSeenNotification = () => {
        if (!isClientConnected || notification.isSeen || !wasSeen) return;
        setNotificationSeen(id);
    };

    // Effect to handle updating the notification's seen status when dependencies change
    useEffect(handleSeenNotification, [wasSeen, isClientConnected]);

    return (
        <FlexStyled ref={wasSeenRef} className={classes.notificationCard} onClick={onClick}>
            <UserCard userId={actorId}>
                <Typography size="1rem" lineClamp={5} className="message">{text}</Typography>
            </UserCard>
            {children}
        </FlexStyled>
    );
}

export default NotificationCard;