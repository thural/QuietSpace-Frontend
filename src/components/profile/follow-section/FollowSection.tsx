import styles from "@/styles/profile/followSectionStyles";
import { ProcedureFn } from "@/types/genericTypes";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import FlexStyled from "@components/shared/FlexStyled";
import Typography from "@components/shared/Typography";

export interface FollowSectionProps extends GenericWrapper {
    postsCount?: number
    followingsCount?: number
    followersCount?: number
    toggleFollowings: ProcedureFn
    toggleFollowers: ProcedureFn
}

const FollowsSection: React.FC<FollowSectionProps> = ({ postsCount, followingsCount, followersCount, toggleFollowings, toggleFollowers, children }) => {

    const classes = styles();

    return (
        <FlexStyled className={classes.followSection}>
            <Typography
                style={{ cursor: "pointer" }}
                ta="center"
                fw="600"
                fz="1.1rem"
                size="lg">{postsCount} posts
            </Typography>
            <FlexStyled style={{ justifyContent: "space-around", gap: "2rem" }}>
                <Typography
                    ta="center"
                    fz="1.1rem"
                    style={{ cursor: "pointer" }}
                    fw="600" onClick={toggleFollowings}>
                    {followingsCount} followings
                </Typography>
                <Typography
                    ta="center"
                    style={{ cursor: "pointer" }}
                    fz="1.1rem"
                    fw="600" onClick={toggleFollowers}>
                    {followersCount} followers
                </Typography>
            </FlexStyled>
            {children}
        </FlexStyled>
    )
};

export default FollowsSection