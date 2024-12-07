import { PostResponse } from "@/api/schemas/inferred/post"
import BoxStyled from "@/components/shared/BoxStyled"
import ErrorComponent from "@/components/shared/errors/ErrorComponent"
import FlexStyled from "@/components/shared/FlexStyled"
import PostSkeleton from "@/components/shared/PostSkeleton"
import Typography from "@/components/shared/Typography"
import UserDetails from "@/components/shared/UserDetails"
import { useGetUserById } from "@/services/data/useUserData"
import { useRepost } from "@/services/hook/feed/useRepost"
import styles from "@/styles/feed/repostCardStyles"
import { isRepost } from "@/utils/typeUtils"
import { PiArrowsClockwiseBold } from "react-icons/pi"
import PostMenu from "../fragments/PostMenu"
import PostCard from "../post/PostCard"

interface RepostCardProps {
    isPostsLoading?: boolean
    post: PostResponse
}

const RepostCard: React.FC<RepostCardProps> = ({ post, isPostsLoading = false }) => {

    const classes = styles();
    let data = undefined;

    try {
        if (!post.repost || !isRepost(post.repost)) throw new TypeError('object is not repost');
        data = useRepost(post.repost);
    } catch (error) {
        return <ErrorComponent message={(error as Error).message} />;
    }


    const { data: user, isLoading, isError, error } = useGetUserById(post.repost.userId);
    if (isError) return <ErrorComponent message={error?.message} />;
    if (isPostsLoading || isLoading || user === undefined) return <PostSkeleton />;


    return (
        <BoxStyled className={classes.repostCard} >
            <FlexStyled className={classes.postHeadline}>
                <PiArrowsClockwiseBold className="repost-icon" />
                <UserDetails scale={5} user={user} isDisplayEmail={false} />
                <Typography>reposted</Typography>
                <PostMenu postId={post.repost.id} isRepost={true} {...data} />
            </FlexStyled>
            <Typography className={classes.replyText}>{post.repost.text}</Typography>
            <PostCard post={post} isMenuHidden={true} />
        </BoxStyled>
    )
}

export default RepostCard