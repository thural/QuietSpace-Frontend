import { PostResponse } from "@/api/schemas/inferred/post"
import { ResId } from "@/api/schemas/native/common"
import PostCard from "@/components/feed/post/PostCard"
import BoxStyled from "@/components/shared/BoxStyled"
import ErrorComponent from "@/components/shared/errors/ErrorComponent"
import PostSkeleton from "@/components/shared/PostSkeleton"
import { useGetLatestComment } from "@/services/data/useCommentData"
import { useGetUserById } from "@/services/data/useUserData"
import CommentBox from "../comment/Comment"
import styles from "@/styles/feed/replyCardStyles"
import { nullishValidationdError } from "@/utils/errorUtils"

interface PostReplyCardProps {
    post: PostResponse
    userId: ResId
}

const PostReplyCard: React.FC<PostReplyCardProps> = ({ post, userId }) => {

    const classes = styles();

    let userData = undefined;
    let commentData = undefined;

    try {
        if (!post || !userId) throw nullishValidationdError({ post, userId });
        userData = useGetUserById(userId);
        commentData = useGetLatestComment(userId, post.id);
        if (userData.isError) throw userData.error;
        if (commentData.isError) throw commentData.error;
    } catch (error) {
        return <ErrorComponent message={(error as Error).message} />;
    }

    const { data: user, isLoading: isUserLoading } = userData;
    const { data: comment, isLoading: isCommentLoading } = commentData;


    const PostContent = () => (
        <>
            <PostCard postId={post.id} isMenuHidden={true} />
            <CommentBox comment={comment} />
        </>
    );

    const RenderResult = () => (
        isCommentLoading || isUserLoading || user === undefined ? <PostSkeleton /> : <PostContent />
    );

    return (
        <BoxStyled className={classes.wrapper} >
            <RenderResult />
        </BoxStyled>
    )
}

export default PostReplyCard