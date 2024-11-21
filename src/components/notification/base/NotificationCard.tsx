import styles from "@/styles/notification/notificationCardStyles";
import { useEffect } from "react";

import UserCard from "@/components/shared/UserCard";
import useWasSeen from "@/services/hook/common/useWasSeen";
import { useNotificationStore } from "@/services/store/zustand";
import { NotificationCardProps } from "@/types/notificationTypes";
import FlexStyled from "@components/shared/FlexStyled";
import Typography from "@components/shared/Typography";




const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onClick, children, text }) => {

    const classes = styles();

    const [wasSeen, wasSeenRef] = useWasSeen();
    const { id, actorId } = notification;
    const { clientMethods } = useNotificationStore();
    const { isClientConnected, setNotificationSeen } = clientMethods;


    const handleSeenNotification = () => {
        if (!isClientConnected || notification.isSeen || !wasSeen) return;
        setNotificationSeen(id);
    };

    useEffect(handleSeenNotification, [wasSeen, isClientConnected]);


    return (
        <FlexStyled ref={wasSeenRef} className={classes.notificationCard} onClick={onClick}>
            <UserCard userId={actorId}>
                <Typography size="1rem" lineClamp={5} className="message">{text}</Typography>
            </UserCard>
            {children}
        </FlexStyled>
    )
}

export default NotificationCard