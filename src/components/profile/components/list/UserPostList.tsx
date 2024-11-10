import { ResId } from "@/api/schemas/native/common";
import PostCard from "@/components/feed/components/post/card/PostCard";
import RepostCard from "@/components/feed/components/repost/RepostCard";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import { useGetPostsByUserId } from "@/services/data/usePostData";
import { LoadingOverlay } from "@mantine/core";

const UserPostList = ({ userId }: { userId: ResId }) => {
    const { data: posts, isLoading, isError, error } = useGetPostsByUserId(userId);
    if (isLoading) return <LoadingOverlay />
    if (isError) return <ErrorComponent message={error.message} />
    return posts?.content.map((post, index) => {
        if (post.repostId === null) return <PostCard key={index} postId={post.id} />;
        return <RepostCard post={post} key={index} />
    });
}

export default UserPostList