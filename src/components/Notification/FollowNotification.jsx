import React, { useEffect, useMemo } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useToggleFollow } from "../../hooks/useUserData";
import NotificationCard from "../Shared/NotificationCard";

const FollowNotification = ({ notification }) => {

    const { actorId } = notification;
    const queryClient = useQueryClient();
    const followings = queryClient.getQueryData(["followings"]);
    const toggleFollow = useToggleFollow();


    const isFollowing = useMemo(() => {
        followings?.content?.some(follow => follow.id === actorId)
    }, [followings]);

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


    return (
        <NotificationCard notification={notification} onClick={handleClick} text={"followed you"}>
            <button type="button" disabled={false} onClick={handleFollowToggle}>{followingStatus()}</button>
        </NotificationCard>
    )
}

export default FollowNotification