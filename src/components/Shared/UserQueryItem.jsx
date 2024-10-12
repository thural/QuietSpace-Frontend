import React from "react";
import styles from "./styles/userQueryItemStyles";

import { Text, Title } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { useToggleFollow } from "../../hooks/useUserData";
import { toUpperFirstChar } from "../../utils/stringUtils";
import BoxStyled from "./BoxStyled";
import FlexStyled from "./FlexStyled";
import UserAvatar from "./UserAvatar";

const UserQueryItem = ({ user, handleItemClick, ...props }) => {

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
        <BoxStyled key={user.id} className={classes.queryItem}>
            <Title order={5} className="username">{user.username}</Title>
            <Text lineClamp={1} truncate="end" className="email">{user.email}</Text>
        </BoxStyled>
    );

    const FollowToggle = () => (
        <button type="button" onClick={handleFollowToggle}>{followStatus()}</button>
    );


    return (
        <FlexStyled className={classes.queryCard} onClick={handleClick} {...props}>
            <UserAvatar radius="10rem" chars={toUpperFirstChar(user.username)} />
            <UserDetails />
            <FollowToggle />
        </FlexStyled>
    )
}

export default UserQueryItem