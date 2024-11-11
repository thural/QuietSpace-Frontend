import { Post } from "@/api/schemas/inferred/post"
import BoxStyled from "@/components/shared/BoxStyled"
import ErrorComponent from "@/components/shared/error/ErrorComponent"
import FlexStyled from "@/components/shared/FlexStyled"
import Typography from "@/components/shared/Typography"
import UserDetails from "@/components/shared/UserDetails"
import { useGetUserById } from "@/services/data/useUserData"
import { nullishValidationdError } from "@/utils/errorUtils"
import { LoadingOverlay } from "@mantine/core"
import { PiArrowsClockwiseBold } from "react-icons/pi"
import PostCard from "../post/card/PostCard"
import { usePost } from "../post/hooks/usePost"
import PostMenu from "../shared/post-menu/PostMenu"
import styles from "./styles/repostCardStyles"

interface RepostCardProps {
    post: Post
}

const RepostCard: React.FC<RepostCardProps> = ({ post }) => {

    let data = undefined;

    const classes = styles();

    try {
        const postId = post.id;
        if (postId === undefined) throw nullishValidationdError({ postId });
        data = usePost(postId);
    } catch (error) {
        return <ErrorComponent message={(error as Error).message} />;
    }

    const {
        handleDeletePost,
        isMutable,
        toggleEditForm,
    } = data;

    const { data: user, isLoading, isError, error } = useGetUserById(post.userId);

    if (isLoading) return <LoadingOverlay />
    if (isError || user === undefined) return <ErrorComponent message={error.message} />



    return (
        <BoxStyled className={classes.wrapper} >
            <BoxStyled className={classes.repostSection}>
                <FlexStyled className={classes.postHeadline}>
                    <PiArrowsClockwiseBold className="repost-icon" />
                    <UserDetails scale={4} user={user} isDisplayEmail={false} />
                    <Typography style={{ margin: '0 .5rem' }}>reposted</Typography>
                    <PostMenu postId={post.id} isRepost={true} handleDeletePost={handleDeletePost} toggleEditForm={toggleEditForm} isMutable={isMutable} />
                </FlexStyled>
                <Typography className={classes.repostText}>{post.repostText}</Typography>
            </BoxStyled>
            <PostCard postId={post.repostId} isMenuHidden={true} />
        </BoxStyled>
    )
}

export default RepostCard