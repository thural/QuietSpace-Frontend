import { FollowSectionContainer, FollowSectionTitle, FollowButton, FollowStats, FollowStat } from "../styles/FollowSectionStyles";
import { ProcedureFn } from "@/shared/types/genericTypes";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";

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
    return (
        <FollowSectionContainer>
            <FollowSectionTitle>{postsCount} posts</FollowSectionTitle>
            <FollowStats>
                <FollowStat>
                    <span className="stat-number">{followingsCount}</span>
                    <span className="stat-label">followings</span>
                </FollowStat>
                <FollowStat>
                    <span className="stat-number">{followersCount}</span>
                    <span className="stat-label">followers</span>
                </FollowStat>
            </FollowStats>
            {children}
        </FollowSectionContainer>
    );
};

export default FollowsSection;