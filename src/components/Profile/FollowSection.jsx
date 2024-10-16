import FlexStyled from "@shared/FlexStyled";
import Typography from "@shared/Typography";
import styles from "./styles/profileContainerStyles";

const FollowsSection = ({ followers, followings, toggleFollowings, toggleFollowers, posts, children }) => {

    const classes = styles();

    return (
        <FlexStyled className={classes.followSection}>
            <Typography style={{ cursor: "pointer" }} ta="center" fw="400" size="lg">{posts.totalElements} posts</Typography>
            <FlexStyled style={{ justifyContent: "space-around", gap: "2rem" }}>
                <Typography
                    ta="center"
                    style={{ cursor: "pointer" }}
                    fw="400" onClick={toggleFollowings}>
                    {followings?.length} followings
                </Typography>
                <Typography
                    ta="center"
                    style={{ cursor: "pointer" }}
                    fw="400" onClick={toggleFollowers}>
                    {followers?.length} followers
                </Typography>
            </FlexStyled>
            {children}
        </FlexStyled>
    )
};

export default FollowsSection