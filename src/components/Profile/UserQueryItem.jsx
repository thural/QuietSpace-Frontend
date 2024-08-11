import React, { useMemo } from "react";
import styles from "./styles/userQueryItemStyles";

import { Avatar, Box, Flex, Text, Title } from "@mantine/core";
import { generatePfp } from "../../utils/randomPfp";
import { useQueryClient } from "@tanstack/react-query";
import { useToggleFollow } from "../../hooks/useUserData";

const QueryItem = ({ user, handleItemClick }) => {

    const queryClient = useQueryClient();
    const followings = queryClient.getQueryData(["followings"]);
    const toggleFollow = useToggleFollow();

    const isFollowing = followings?.content?.some(follow => follow.id === user.id)


    const handleClick = (event) => {
        event.preventDefault();
        handleItemClick(event, user);
    }

    const handleFollowToggle = (event) => {
        event.preventDefault();
        toggleFollow.mutate(user.id);
    }


    const classes = styles();

    return (
        <Flex className={classes.queryCard} onClick={handleClick}>
            <Avatar
                color="black"
                size="2.5rem"
                radius="10rem"
                src={generatePfp("beam")}>
                {user.username[0].toUpperCase()}
            </Avatar>
            <Box key={user.id} className={classes.queryItem}>
                <Title order={5} className="username">{user.username}</Title>
                <Text lineClamp={1} truncate="end" className="email">{user.email}</Text>
            </Box>
            <button type="button" onClick={handleFollowToggle}>{isFollowing ? "unfollow" : "follow"}</button>
        </Flex>
    )
}

export default QueryItem