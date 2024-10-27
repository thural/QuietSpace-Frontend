import FlexStyled from "@components/shared/FlexStyled";
import Typography from "@components/shared/Typography";
import styles from "./styles/followSectionStyles";
import { FollowSectionProps } from "./types/followSectionTypes";
import { UserPage } from "@/api/schemas/inferred/user";
import { PostPage } from "@/api/schemas/inferred/post";
import { getFollowersByUserId, getFollowingsByUserId } from "@/api/queries/userQueries";
import { getPostsByUserId } from "@/api/queries/postQueries";

const FollowsSection: React.FC<FollowSectionProps> = ({ userId, toggleFollowings, toggleFollowers, children }) => {

    const classes = styles();

    const followersData: UserPage | undefined = getFollowersByUserId(userId);
    const followingData: UserPage | undefined = getFollowingsByUserId(userId);
    const postData: PostPage | undefined = getPostsByUserId(userId);

    return (
        <FlexStyled className={classes.followSection}>
            <Typography style={{ cursor: "pointer" }} ta="center" fw="400" size="lg">{postData?.totalElements} posts</Typography>
            <FlexStyled style={{ justifyContent: "space-around", gap: "2rem" }}>
                <Typography
                    ta="center"
                    style={{ cursor: "pointer" }}
                    fw="400" onClick={toggleFollowings}>
                    {followingData?.totalElements} followings
                </Typography>
                <Typography
                    ta="center"
                    style={{ cursor: "pointer" }}
                    fw="400" onClick={toggleFollowers}>
                    {followersData?.totalElements} followers
                </Typography>
            </FlexStyled>
            {children}
        </FlexStyled>
    )
};

export default FollowsSection