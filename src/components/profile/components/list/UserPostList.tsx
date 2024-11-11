import { ResId } from "@/api/schemas/native/common";
import PostCard from "@/components/feed/components/post/card/PostCard";
import RepostCard from "@/components/feed/components/repost/RepostCard";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import { useGetPostsByUserId, useGetSavedPostsByUserId } from "@/services/data/usePostData";
import { LoadingOverlay } from "@mantine/core";

interface UserPostListProps {
    userId: ResId
    isReposts?: boolean
    isSavedPosts?: boolean
}

const UserPostList: React.FC<UserPostListProps> = ({ userId, isReposts = false, isSavedPosts = false }) => {
    const { data: posts, isLoading, isError, error } = !isSavedPosts ? useGetPostsByUserId(userId) : useGetSavedPostsByUserId(userId);
    if (isLoading) return <LoadingOverlay />;
    if (isError) return <ErrorComponent message={error.message} />;
    return posts?.content
        .filter(post => (!!post.repostId === isReposts))
        .map((post, index) => {
            if (post.repostId === null) return <PostCard key={index} postId={post.id} />;
            return <RepostCard post={post} key={index} />
        });
}

export default UserPostList