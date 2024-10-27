import FlexStyled from "@components/shared/FlexStyled";
import Typography from "@components/shared/Typography";
import styles from "./styles/followSectionStyles";
import { FollowSectionProps } from "./types/followSectionTypes";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";

const FollowsSection: React.FC<FollowSectionProps> = ({ posts, followings, followers, toggleFollowings, toggleFollowers, children }) => {

    const classes = styles();

    if (!followers || !followings || !posts) return <FullLoadingOverlay />

    return (
        <FlexStyled className={classes.followSection}>
            <Typography style={{ cursor: "pointer" }} ta="center" fw="400" size="lg">{posts.data?.totalElements} posts</Typography>
            <FlexStyled style={{ justifyContent: "space-around", gap: "2rem" }}>
                <Typography
                    ta="center"
                    style={{ cursor: "pointer" }}
                    fw="400" onClick={toggleFollowings}>
                    {followings.data?.totalElements} followings
                </Typography>
                <Typography
                    ta="center"
                    style={{ cursor: "pointer" }}
                    fw="400" onClick={toggleFollowers}>
                    {followers.data?.totalElements} followers
                </Typography>
            </FlexStyled>
            {children}
        </FlexStyled>
    )
};

export default FollowsSection