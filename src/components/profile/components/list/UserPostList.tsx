import { ResId } from "@/api/schemas/native/common";
import ReplyCard from "@/components/feed/components/comment/reply/ReplyCard";
import PostCard from "@/components/feed/components/post/card/PostCard";
import RepostCard from "@/components/feed/components/repost/RepostCard";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import { useGetPostsByUserId, useGetRepliedPostsByUserId, useGetSavedPostsByUserId } from "@/services/data/usePostData";
import { LoadingOverlay } from "@mantine/core";

interface UserPostListProps {
    userId: ResId
    isReposts?: boolean
    isSavedPosts?: boolean
    isRepliedPosts?: boolean
}

const UserPostList: React.FC<UserPostListProps> = ({ userId, isReposts = false, isSavedPosts = false, isRepliedPosts = false }) => {

    const { data: posts, isLoading, isError, error } = isRepliedPosts ? useGetRepliedPostsByUserId(userId)
        : !isSavedPosts ? useGetPostsByUserId(userId) : useGetSavedPostsByUserId(userId);

    if (isLoading) return <LoadingOverlay />;
    if (isError) return <ErrorComponent message={error.message} />;

    return posts?.content
        .filter(post => (!!post.repostId === isReposts))
        .map((post, index) => {
            if (isRepliedPosts) return <ReplyCard post={post} userId={userId} />
            if (post.repostId === null) return <PostCard key={index} postId={post.id} />;
            return <RepostCard post={post} key={index} />
        });
}

export default UserPostList