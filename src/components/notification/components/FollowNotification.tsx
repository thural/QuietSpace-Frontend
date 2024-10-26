import { useMemo } from "react";

import { useToggleFollow } from "@/hooks/data/useUserData";
import LightButton from "@components/shared/buttons/LightButton";
import { useQueryClient } from "@tanstack/react-query";
import NotificationCard from "./base/NotificationCard";
import { NotificationItemProps } from "@/types/notificationTypes";
import { PageContent } from "@/api/schemas/inferred/common";
import { User } from "@/api/schemas/inferred/user";

const FollowNotification: React.FC<NotificationItemProps> = ({ notification }) => {

    const { actorId } = notification;
    const queryClient = useQueryClient();
    const followings: PageContent<User> | undefined = queryClient.getQueryData(["followings"]);
    const toggleFollow = useToggleFollow();


    const isFollowing = useMemo(() => followings?.some(follow => follow.id === actorId) ? "unfollow" : "follow", [followings]);

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        // TODO: navigate to user page
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