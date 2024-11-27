import { UserResponse } from "@/api/schemas/inferred/user";
import { useToggleFollow } from "@/services/data/useUserData";
import LightButton from "@components/shared/buttons/LightButton";
import React from "react";
import { GenericWrapper } from "../../types/sharedComponentTypes";

interface FollowToggleProps extends GenericWrapper {
    user: UserResponse
    Button?: React.ComponentType
}

const FollowToggle: React.FC<FollowToggleProps> = ({ user, Button = LightButton, ...props }) => {

    const followStatus = user.isFollowing ? "unfollow" : "follow";
    const toggleFollow = useToggleFollow(user.id);

    const handleFollowToggle = (event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        toggleFollow.mutate(user.id);
    }


    return (
        <Button name={followStatus} onClick={handleFollowToggle} {...props} />
    )
};

export default FollowToggle