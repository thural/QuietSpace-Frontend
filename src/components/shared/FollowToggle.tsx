import { useToggleFollow } from "@/services/data/useUserData";
import LightButton from "@components/shared/buttons/LightButton";
import { useQueryClient } from "@tanstack/react-query";
import { GenericWrapper } from "./types/sharedComponentTypes";
import { UserPage } from "@/api/schemas/inferred/user";

const FollowToggle: React.FC<GenericWrapper> = ({ user, Button = LightButton, ...props }) => {

    const queryClient = useQueryClient();
    const followings: UserPage | undefined = queryClient.getQueryData(["followings"]);
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