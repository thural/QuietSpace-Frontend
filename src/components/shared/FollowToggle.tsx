import LightButton from "@components/shared/buttons/LightButton";
import { useToggleFollow } from "@/services/data/useUserData";
import { GenericWrapper } from "./types/sharedComponentTypes";
import { User } from "@/api/schemas/inferred/user";
import { getFollowingsByUserId } from "@/api/queries/userQueries";
import { Page } from "@/api/schemas/inferred/common";
import React from "react";

interface FollowToggleProps extends GenericWrapper {
    user: User
    Button?: React.ComponentType
}

const FollowToggle: React.FC<FollowToggleProps> = ({ user, Button = LightButton, ...props }) => {

    const followings: Page<User> | undefined = getFollowingsByUserId(user.id);
    const isFollowing = followings?.content?.some(follow => follow.id === user.id);

    const followStatus = isFollowing ? "unfollow" : "follow";
    const toggleFollow = useToggleFollow();

    const handleFollowToggle = (event: Event) => {
        event.preventDefault();
        toggleFollow.mutate(user.id);
    }


    return (
        <Button name={followStatus} onClick={handleFollowToggle} {...props} />
    )
};

export default FollowToggle