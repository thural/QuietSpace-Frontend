import React, { useEffect, useMemo } from "react";
import styles from "./styles/notificationCardStyles";

import { Avatar, Box, Flex, Text, Title } from "@mantine/core";
import { generatePfp } from "../../utils/randomPfp";
import { useQueryClient } from "@tanstack/react-query";
import { useToggleFollow } from "../../hooks/useUserData";
import useWasSeen from "../../hooks/useWasSeen";
import { useNotificationStore } from "../../hooks/zustand";

const FollowNotification = ({ notification }) => {

    const { id, actorId, username, isSeen } = notification;
    const queryClient = useQueryClient();
    const followings = queryClient.getQueryData(["followings"]);
    const toggleFollow = useToggleFollow();
    const [wasSeen, ref] = useWasSeen();
    const { clientMethods } = useNotificationStore();
    const { isClientConnected, setNotificationSeen } = clientMethods;



    const isFollowing = useMemo(() => {
        followings?.content?.some(follow => follow.id === actorId)
    }, [followings]);

    const handleSeenNotification = () => {
        if (!isClientConnected || isSeen || !wasSeen) return;
        setNotificationSeen(id);
    };

    useEffect(handleSeenNotification, [wasSeen, isClientConnected]);

    const handleClick = (event) => {
        event.preventDefault();
        // TODO: navigate to user page
    }

    const handleFollowToggle = (event) => {
        event.preventDefault();
        toggleFollow.mutate(actorId);
    }

    const followingStatus = () => {
        return isFollowing ? "unfollow" : "follow";
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
                <Text size="1rem" lineClamp={5} className="message">{"followed you"}</Text>
            </Box>
            <button type="button" disabled={false} onClick={handleFollowToggle}>{followingStatus()}</button>
        </Flex>
    )
}

export default FollowNotification