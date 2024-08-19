import React, { useEffect } from "react";
import styles from "./styles/notificationCardStyles";

import { Avatar, Box, Flex, Text, Title } from "@mantine/core";
import { generatePfp } from "../../utils/randomPfp";
import { NotificationType } from "../../utils/enumClasses";
import useWasSeen from "../../hooks/useWasSeen";
import useNotificationSocket from "../../hooks/useNotificationSocket";

const PostNotification = ({ notification }) => {

    const [wasSeen, ref] = useWasSeen();
    const { id, username, type } = notification;
    const { isClientConnected, setNotificationSeen } = useNotificationSocket();


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



    const classes = styles();

    return (
        <Flex ref={ref} className={classes.notificationCard} onClick={handleClick}>
            <Avatar
                color="black"
                size="2.5rem"
                radius="10rem"
                src={generatePfp("beam")}>
                {username.charAt(0).toUpperCase()}
            </Avatar>
            <Box key={id} className={classes.notificationItem}>
                <Title order={5} className="username">{username}</Title>
                <Text size="1rem" lineClamp={5} className="message">{getTextContent()}</Text>
            </Box>
        </Flex>
    )
}

export default PostNotification