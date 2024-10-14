import React, { useMemo } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useToggleFollow } from "../../hooks/useUserData";
import LightButton from "../Shared/buttons/LightButton";
import NotificationCard from "./NotificationCard";

const FollowNotification = ({ notification }) => {

    const { actorId } = notification;
    const queryClient = useQueryClient();
    const followings = queryClient.getQueryData(["followings"]);
    const toggleFollow = useToggleFollow();


    const isFollowing = useMemo(() => followings?.content?.some(follow => follow.id === actorId) ? "unfollow" : "follow", [followings]);

    const handleClick = (event) => {
        event.preventDefault();
        // TODO: navigate to user page
    }

    const handleFollowToggle = (event) => {
        event.preventDefault();
        toggleFollow.mutate(actorId);
    }


    return (
        <NotificationCard notification={notification} onClick={handleClick} text={"followed you"}>
            <LightButton name={isFollowing} disabled={false} onClick={handleFollowToggle} />
        </NotificationCard>
    )
}

export default FollowNotification