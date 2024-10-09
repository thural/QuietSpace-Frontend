import React, { useEffect } from "react";
import styles from "./styles/notificationCardStyles";

import { Avatar, Box, Flex, Text, Title } from "@mantine/core";
import { NotificationType } from "../../utils/enumClasses";
import useWasSeen from "../../hooks/useWasSeen";
import { useNotificationStore } from "../../hooks/zustand";
import { toUpperFirstChar } from "../../utils/stringUtils";

const PostNotification = ({ notification }) => {

    const classes = styles();

    const [wasSeen, ref] = useWasSeen();
    const { id, username, type } = notification;
    const { clientMethods } = useNotificationStore();
    const { isClientConnected, setNotificationSeen } = clientMethods;


    const handleSeenNotification = () => {
        if (!isClientConnected || notification.isSeen || !wasSeen) return;
        setNotificationSeen(id);
    };

    useEffect(handleSeenNotification, [wasSeen, isClientConnected]);

    const handleClick = (event) => {
        event.preventDefault();
        // TODO: navigate to post page
    }

    const getTextContent = () => {
        switch (type) {
            case NotificationType.POST_REACTION.name:
                return "reacted to your post";
            case NotificationType.COMMENT.name:
                return "commented your post";
            case NotificationType.REPOST.name:
                return "reposted your post";
            default:
                return "mentioned you";
        }
    }


    return (
        <Flex ref={ref} className={classes.notificationCard} onClick={handleClick}>
            <Avatar color="black" size="2.5rem" radius="10rem">{toUpperFirstChar(username)}</Avatar>
            <Box key={id} className={classes.notificationItem}>
                <Title order={5} className="username">{username}</Title>
                <Text size="1rem" lineClamp={5} className="message">{getTextContent()}</Text>
            </Box>
        </Flex>
    )
}

export default PostNotification