import { PostResponse } from "@/api/schemas/inferred/post"
import { ResId } from "@/api/schemas/native/common"
import PostCard from "@/components/feed/post/PostCard"
import ErrorComponent from "@/components/shared/errors/ErrorComponent"
import PostSkeleton from "@/components/shared/PostSkeleton"
import { useGetLatestComment } from "@/services/data/useCommentData"
import { useGetUserById } from "@/services/data/useUserData"
import CommentBox from "../comment/Comment"

interface PostReplyCardProps {
    post: PostResponse
    userId: ResId
}

const PostReplyCard: React.FC<PostReplyCardProps> = ({ post, userId }) => {

    let userData = undefined;
    let commentData = undefined;

    try {
        if (!userId) throw new Error("userId is undefined");
        if (!post) throw new Error("post is undefined");
        userData = useGetUserById(userId);
        commentData = useGetLatestComment(userId, post.id);
        if (userData.isError) throw userData.error;
        if (commentData.isError) throw commentData.error;
    } catch (error) {
        return <ErrorComponent message={(error as Error).message} />;
    }

    const { data: user, isLoading: isUserLoading } = userData;
    const { data: comment, isLoading: isCommentLoading } = commentData;

    if (isCommentLoading || isUserLoading || !user || !comment) return <PostSkeleton />

    return (
        <>
            <PostCard post={post} isMenuHidden={true} />
            <CommentBox comment={comment} />
        </>
    )
}

export default PostReplyCard