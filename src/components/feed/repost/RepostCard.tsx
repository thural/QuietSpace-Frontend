import { PostResponse } from "@/api/schemas/inferred/post"
import BoxStyled from "@/components/shared/BoxStyled"
import ErrorComponent from "@/components/shared/errors/ErrorComponent"
import FlexStyled from "@/components/shared/FlexStyled"
import PostSkeleton from "@/components/shared/PostSkeleton"
import Typography from "@/components/shared/Typography"
import UserDetails from "@/components/shared/UserDetails"
import { useGetUserById } from "@/services/data/useUserData"
import { nullishValidationdError } from "@/utils/errorUtils"
import { PiArrowsClockwiseBold } from "react-icons/pi"
import PostCard from "../post/PostCard"
import { usePost } from "@/services/hook/feed/usePost"
import PostMenu from "../fragments/PostMenu"
import styles from "@/styles/feed/repostCardStyles"

interface RepostCardProps {
    isPostsLoading?: boolean
    post: PostResponse
}

const RepostCard: React.FC<RepostCardProps> = ({ post, isPostsLoading = false }) => {

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

    if (isError) return <ErrorComponent message={error?.message} />


    const PostContent = () => (
        <>
            <BoxStyled className={classes.repostSection}>
                <FlexStyled className={classes.postHeadline}>
                    <PiArrowsClockwiseBold className="repost-icon" />
                    <UserDetails scale={5} user={user} isDisplayEmail={false} />
                    <Typography style={{ margin: '0 .5rem' }}>reposted</Typography>
                    <PostMenu postId={post.id} isRepost={true} handleDeletePost={handleDeletePost} toggleEditForm={toggleEditForm} isMutable={isMutable} />
                </FlexStyled>
                <Typography className={classes.repostText}>{post.repostText}</Typography>
            </BoxStyled>
            <PostCard postId={post.repostId} isMenuHidden={true} />
        </>
    );

    const RenderResult = () => (
        isPostsLoading || isLoading || user === undefined ? <PostSkeleton /> : <PostContent />
    );
    return (
        <BoxStyled className={classes.wrapper} >
            <RenderResult />
        </BoxStyled>
    )
}

export default RepostCard