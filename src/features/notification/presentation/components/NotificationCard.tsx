import { NotificationCard as NotificationCardStyled } from "../styles/notificationCardStyles";
import { useEffect } from "react";

import UserCard from "@shared/ui/components/user/UserCard/UserCard";
import useWasSeen from "@notification/application/hooks/useWasSeen";
import { useNotificationStore } from "@core/store/zustand";
import { NotificationCardProps } from "@notification/types/notificationTypes";
import { Text } from "../../../../shared/ui/components";

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
        <NotificationCardStyled ref={wasSeenRef} onClick={onClick}>
            <UserCard userId={actorId}>
                <Text size="1rem" className="message">{text}</Text>
            </UserCard>
            {children}
        </NotificationCardStyled>
    );
}

export default NotificationCard;