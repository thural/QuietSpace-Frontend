
import FollowToggle from "@/components/shared/FollowToggle";
import { useGetUserById } from "@/services/data/useUserData";
import { NotificationItemProps } from "@/types/notificationTypes";
import { useNavigate } from "react-router-dom";
import NotificationCard from "../base/NotificationCard";
import NotificationSkeleton from "@/components/shared/NotificationSkeleton";

const FollowNotification: React.FC<NotificationItemProps> = ({ notification }) => {

    const navigate = useNavigate();
    const { actorId } = notification;
    const { data: user, isLoading } = useGetUserById(actorId);


    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        navigate(`/profile/${actorId}`);
    };

    if (isLoading || user === undefined) return <NotificationSkeleton />;

    return (
        <NotificationCard notification={notification} onClick={handleClick} text={"followed you"}>
            <FollowToggle user={user} />
        </NotificationCard>
    )
}

export default FollowNotification