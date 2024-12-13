import styles from "@/styles/profile/followSectionStyles";
import { ProcedureFn } from "@/types/genericTypes";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import FlexStyled from "@components/shared/FlexStyled";
import Typography from "@components/shared/Typography";

/**
 * FollowSectionProps interface.
 * 
 * This interface defines the props for the FollowsSection component.
 * 
 * @property {number} [postsCount] - The number of posts made by the user.
 * @property {number} [followingsCount] - The number of accounts the user is following.
 * @property {number} [followersCount] - The number of accounts following the user.
 * @property {ProcedureFn} toggleFollowings - Function to toggle the followings view.
 * @property {ProcedureFn} toggleFollowers - Function to toggle the followers view.
 */
export interface FollowSectionProps extends GenericWrapper {
    postsCount?: number;
    followingsCount?: number;
    followersCount?: number;
    toggleFollowings: ProcedureFn;
    toggleFollowers: ProcedureFn;
}

/**
 * FollowsSection component.
 * 
 * This component displays the user's posts, followings, and followers counts.
 * It provides clickable elements for toggling the followings and followers views.
 * The component is styled using Flexbox for layout, and accepts additional children for rendering.
 * 
 * @param {FollowSectionProps} props - The component props.
 * @returns {JSX.Element} - The rendered FollowsSection component.
 */
const FollowsSection: React.FC<FollowSectionProps> = ({
    postsCount,
    followingsCount,
    followersCount,
    toggleFollowings,
    toggleFollowers,
    children
}) => {
    const classes = styles();

    return (
        <FlexStyled className={classes.followSection}>
            <Typography
                style={{ cursor: "pointer" }}
                ta="center"
                fw="600"
                fz="1.1rem"
                size="lg">
                {postsCount} posts
            </Typography>
            <FlexStyled style={{ justifyContent: "space-around", gap: "2rem" }}>
                <Typography
                    ta="center"
                    fz="1.1rem"
                    style={{ cursor: "pointer" }}
                    fw="600"
                    onClick={toggleFollowings}>
                    {followingsCount} followings
                </Typography>
                <Typography
                    ta="center"
                    style={{ cursor: "pointer" }}
                    fz="1.1rem"
                    fw="600"
                    onClick={toggleFollowers}>
                    {followersCount} followers
                </Typography>
            </FlexStyled>
            {children}
        </FlexStyled>
    );
};

export default FollowsSection;