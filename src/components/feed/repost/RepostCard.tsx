import { PostResponse } from "@/api/schemas/inferred/post"
import BoxStyled from "@/components/shared/BoxStyled"
import ErrorComponent from "@/components/shared/errors/ErrorComponent"
import FlexStyled from "@/components/shared/FlexStyled"
import PostSkeleton from "@/components/shared/PostSkeleton"
import Typography from "@/components/shared/Typography"
import UserDetails from "@/components/shared/UserDetails"
import { useGetUserById } from "@/services/data/useUserData"
import { usePost } from "@/services/hook/feed/usePost"
import styles from "@/styles/feed/repostCardStyles"
import { nullishValidationdError } from "@/utils/errorUtils"
import { PiArrowsClockwiseBold } from "react-icons/pi"
import PostMenu from "../fragments/PostMenu"
import PostCard from "../post/PostCard"

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


    const { data: user, isLoading, isError, error } = useGetUserById(post.userId);
    if (isError) return <ErrorComponent message={error?.message} />;
    if (isPostsLoading || isLoading || user === undefined) return <PostSkeleton />;


    return (
        <BoxStyled className={classes.repostCard} >
            <BoxStyled>
                <FlexStyled className={classes.postHeadline}>
                    <PiArrowsClockwiseBold className="repost-icon" />
                    <UserDetails scale={5} user={user} isDisplayEmail={false} />
                    <Typography>reposted</Typography>
                    <PostMenu postId={post.id} isRepost={true} {...data} />
                </FlexStyled>
                <Typography className={classes.replyText}>{post.repostText}</Typography>
            </BoxStyled>
            <PostCard post={post} isMenuHidden={true} />
        </BoxStyled>
    )
}

export default RepostCard