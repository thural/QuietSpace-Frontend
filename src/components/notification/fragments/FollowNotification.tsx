
import { useGetUserById, useToggleFollow } from "@/services/data/useUserData";
import { NotificationItemProps } from "@/types/notificationTypes";
import LightButton from "@components/shared/buttons/LightButton";
import { useNavigate } from "react-router-dom";
import NotificationCard from "../base/NotificationCard";

const FollowNotification: React.FC<NotificationItemProps> = ({ notification }) => {

    const navigate = useNavigate();
    const { actorId } = notification;
    const user = useGetUserById(actorId);
    const toggleFollow = useToggleFollow(actorId);
    const isFollowing = user.data?.isFollowing ? "unfollow" : "follow";


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