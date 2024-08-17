import React from "react";
import styles from "./styles/userQueryItemStyles";

import { generatePfp } from "../../utils/randomPfp";
import { useQueryClient } from "@tanstack/react-query";
import { useToggleFollow } from "../../hooks/useUserData";
import { Avatar, Box, Flex, Text, Title } from "@mantine/core";

const QueryItem = ({ user, handleItemClick }) => {

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
        return isFollowing ? "unfollow" : "follow"
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
            <button type="button" disabled={false} onClick={handleFollowToggle}>{followStatus()}</button>
        </Flex>
    )
}

export default QueryItem