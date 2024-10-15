import LightButton from "@shared/buttons/LightButton";

const FollowToggle = ({ isEnabled, ...props }) => {
    const followStatus = isEnabled ? "unfollow" : "follow";
    return (
        <LightButton name={followStatus} {...props} />
    )
};

export default FollowToggle