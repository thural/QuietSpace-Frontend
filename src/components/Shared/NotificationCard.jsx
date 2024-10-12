import React, { useEffect } from "react";
import styles from "./styles/notificationCardStyles";

import { Text, Title } from "@mantine/core";
import useWasSeen from "../../hooks/useWasSeen";
import { useNotificationStore } from "../../hooks/zustand";
import { toUpperFirstChar } from "../../utils/stringUtils";
import BoxStyled from "./BoxStyled";
import FlexStyled from "./FlexStyled";
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
                <Title order={5} className="username">{username}</Title>
                <Text size="1rem" lineClamp={5} className="message">{text}</Text>
            </BoxStyled>
            {children}
        </FlexStyled>
    )
}

export default NotificationCard