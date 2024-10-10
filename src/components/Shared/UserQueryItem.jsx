import React from "react";
import styles from "./styles/userQueryItemStyles";

import { Box, Flex, Text, Title } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { useToggleFollow } from "../../hooks/useUserData";
import { toUpperFirstChar } from "../../utils/stringUtils";
import UserAvatar from "./UserAvatar";

const UserQueryItem = ({ user, handleItemClick }) => {

    const classes = styles();

    const queryClient = useQueryClient();
    const toggleFollow = useToggleFollow();
    const followings = queryClient.getQueryData(["followings"]);
    const isFollowing = followings?.content?.some(follow => follow.id === user.id);


    const handleClick = (event) => {
        event.preventDefault();
        handleItemClick(event, user);
    }

    const handleFollowToggle = (event) => {
        event.preventDefault();
        toggleFollow.mutate(user.id);
    }

    const followStatus = () => {
        return isFollowing ? "unfollow" : "follow";
    }

    const UserDetails = () => (
        <Box key={user.id} className={classes.queryItem}>
            <Title order={5} className="username">{user.username}</Title>
            <Text lineClamp={1} truncate="end" className="email">{user.email}</Text>
        </Box>
    );

    const FollowToggle = () => (
        <button type="button" onClick={handleFollowToggle}>{followStatus()}</button>
    );


    return (
        <Flex className={classes.queryCard} onClick={handleClick}>
            <UserAvatar radius="10rem" chars={toUpperFirstChar(user.username)} />
            <UserDetails />
            <FollowToggle />
        </Flex>
    )
}

export default UserQueryItem