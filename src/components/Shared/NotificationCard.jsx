import React, { useEffect } from "react";
import styles from "./styles/notificationCardStyles";

import useWasSeen from "../../hooks/useWasSeen";
import { useNotificationStore } from "../../hooks/zustand";
import { toUpperFirstChar } from "../../utils/stringUtils";
import BoxStyled from "./BoxStyled";
import FlexStyled from "./FlexStyled";
import Typography from "./Typography";
import UserAvatar from "./UserAvatar";

const NotificationCard = ({ notification, onClick, children, text }) => {

    const classes = styles();

    const [wasSeen, ref] = useWasSeen();
    const { id, username } = notification;
    const { clientMethods } = useNotificationStore();
    const { isClientConnected, setNotificationSeen } = clientMethods;


    const handleSeenNotification = () => {
        if (!isClientConnected || notification.isSeen || !wasSeen) return;
        setNotificationSeen(id);
    };

    useEffect(handleSeenNotification, [wasSeen, isClientConnected]);


    return (
        <FlexStyled ref={ref} className={classes.notificationCard} onClick={onClick}>
            <UserAvatar chars={toUpperFirstChar(username)} />
            <BoxStyled className={classes.notificationItem}>
                <Typography type="5" className="username">{username}</Typography>
                <Typography size="1rem" lineClamp={5} className="message">{text}</Typography>
            </BoxStyled>
            {children}
        </FlexStyled>
    )
}

export default NotificationCard