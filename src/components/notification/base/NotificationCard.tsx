import styles from "@/styles/notification/notificationCardStyles";
import { useEffect } from "react";

import useWasSeen from "@/services/hook/common/useWasSeen";
import { useNotificationStore } from "@/services/store/zustand";
import { NotificationCardProps } from "@/types/notificationTypes";
import { toUpperFirstChar } from "@/utils/stringUtils";
import BoxStyled from "@components/shared/BoxStyled";
import FlexStyled from "@components/shared/FlexStyled";
import Typography from "@components/shared/Typography";
import UserAvatar from "@components/shared/UserAvatar";




const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onClick, children, text }) => {

    const classes = styles();

    const [wasSeen, wasSeenRef] = useWasSeen();
    const { id, username } = notification;
    const { clientMethods } = useNotificationStore();
    const { isClientConnected, setNotificationSeen } = clientMethods;


    const handleSeenNotification = () => {
        if (!isClientConnected || notification.isSeen || !wasSeen) return;
        setNotificationSeen(id);
    };

    useEffect(handleSeenNotification, [wasSeen, isClientConnected]);


    return (
        <FlexStyled ref={wasSeenRef} className={classes.notificationCard} onClick={onClick}>
            <UserAvatar chars={toUpperFirstChar(username)} />
            <BoxStyled className={classes.notificationDetails}>
                <Typography type="h5" className="username">{username}</Typography>
                <Typography size="1rem" lineClamp={5} className="message">{text}</Typography>
            </BoxStyled>
            {children}
        </FlexStyled>
    )
}

export default NotificationCard