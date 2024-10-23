import { useToggleFollow } from "@/hooks/data/useUserData";
import LightButton from "@components/shared/buttons/LightButton";
import { useQueryClient } from "@tanstack/react-query";

const FollowToggle = ({ user, Button = LightButton, ...props }) => {

    const queryClient = useQueryClient();
    const followings = queryClient.getQueryData(["followings"]);
    const isFollowing = followings?.content?.some(follow => follow.id === user.id);

    const followStatus = isFollowing ? "unfollow" : "follow";
    const toggleFollow = useToggleFollow();

    const handleFollowToggle = (event) => {
        event.preventDefault();
        toggleFollow.mutate(user.id);
    }


    return (
        <Button name={followStatus} onClick={handleFollowToggle} {...props} />
    )
};

export default FollowToggle