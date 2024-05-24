import React from "react";
import styles from "./styles/userQueryItemStyles";

import {Avatar, Box, Button, Flex, Text, Title} from "@mantine/core";
import { generatePfp } from "../../utils/randomPfp";
import {useQueryClient} from "@tanstack/react-query";
import {useToggleFollow} from "../../hooks/useUserData";

const QueryItem = ({ user, handleItemClick }) => {

    const queryClient = useQueryClient();
    const follows = queryClient.getQueryData(["follows"]);
    const toggleFollow = useToggleFollow();

    console.log("follows in user query item: ", follows);

    const isFollowing = follows?.content?.some(follow => follow.followingId === user.id);

    const classes = styles();

    const handleClick = (event) => {
        event.preventDefault();
        handleItemClick(event, user);
        console.log("QUERY ITEM WAS CLICKED");
    }

    const handleFollowToggle = (event) => {
        event.preventDefault();
        toggleFollow.mutate(user.id);
    }

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
            <button type="button" disabled={false} onClick={handleFollowToggle}>{isFollowing ? "unfollow" : "follow"}</button>
        </Flex>
    )
}

export default QueryItem