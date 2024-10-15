import React from "react";
import styles from "./styles/userQueryItemStyles";

import { useToggleFollow } from "@hooks/useUserData";
import { useQueryClient } from "@tanstack/react-query";
import { toUpperFirstChar } from "@utils/stringUtils";
import FlexStyled from "./FlexStyled";
import FollowToggle from "./FollowToggle";
import UserAvatar from "./UserAvatar";
import UserDetails from "./UserDetails";

const UserQueryItem = ({ data: user, handleItemClick, ...props }) => {

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


    return (
        <FlexStyled className={classes.userCard} onClick={handleClick} {...props}>
            <UserAvatar radius="10rem" chars={toUpperFirstChar(user.username)} />
            <UserDetails user={user} />
            <FollowToggle onClick={handleFollowToggle} isEnabled={isFollowing} />
        </FlexStyled>
    )
}

export default UserQueryItem