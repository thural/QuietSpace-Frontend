import React from "react";
import styles from "./styles/userQueryItemStyles";

import { useQueryClient } from "@tanstack/react-query";
import { useToggleFollow } from "../../hooks/useUserData";
import { toUpperFirstChar } from "../../utils/stringUtils";
import FlexStyled from "./FlexStyled";
import UserAvatar from "./UserAvatar";
import UserDetails from "./UserDetails";

const UserQueryItem = ({ data: user, handleItemClick, ...props }) => {

    const classes = styles();

    console.log("Connection query item: ", user);

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

    const FollowToggle = () => (
        <button type="button" onClick={handleFollowToggle}>{followStatus()}</button>
    );


    return (
        <FlexStyled className={classes.userCard} onClick={handleClick} {...props}>
            <UserAvatar radius="10rem" chars={toUpperFirstChar(user.username)} />
            <UserDetails user={user} />
            <FollowToggle />
        </FlexStyled>
    )
}

export default UserQueryItem