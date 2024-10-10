import React, { useEffect } from "react";
import styles from "./styles/notificationCardStyles";

import UserAvatar from "./UserAvatar";
import useWasSeen from "../../hooks/useWasSeen";
import { Box, Flex, Text, Title } from "@mantine/core";
import { toUpperFirstChar } from "../../utils/stringUtils";
import { useNotificationStore } from "../../hooks/zustand";

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
        <Flex ref={ref} className={classes.notificationCard} onClick={onClick}>
            <UserAvatar chars={toUpperFirstChar(username)} />
            <Box className={classes.notificationItem}>
                <Title order={5} className="username">{username}</Title>
                <Text size="1rem" lineClamp={5} className="message">{text}</Text>
            </Box>
            {children}
        </Flex>
    )
}

export default NotificationCard