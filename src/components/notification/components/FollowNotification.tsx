import { useMemo } from "react";

import { useToggleFollow } from "@/services/data/useUserData";
import LightButton from "@components/shared/buttons/LightButton";
import NotificationCard from "./base/NotificationCard";
import { NotificationItemProps } from "@/types/notificationTypes";
import { Page } from "@/api/schemas/inferred/common";
import { User } from "@/api/schemas/inferred/user";
import { getFollowingsByUser, getSignedUser } from "@/api/queries/userQueries";
import { nullishValidationdError } from "@/utils/errorUtils";
import { useNavigate } from "react-router-dom";

const FollowNotification: React.FC<NotificationItemProps> = ({ notification }) => {

    const navigate = useNavigate();
    const { actorId } = notification;
    const user = getSignedUser();
    if (user === undefined) throw nullishValidationdError({ user });
    const followings: Page<User> | undefined = getFollowingsByUser(user.id);
    const toggleFollow = useToggleFollow();


    const isFollowing = useMemo(() => followings?.content.some(follow => follow.id === actorId) ? "unfollow" : "follow", [followings]);

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        navigate(`/profile/${actorId}`);
    };


    const handleFollowToggle = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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