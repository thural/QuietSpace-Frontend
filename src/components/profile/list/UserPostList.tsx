import { ResId } from "@/api/schemas/native/common";
import PostCard from "@/components/feed/post/PostCard";
import PostReplyCard from "@/components/feed/post/PostReplyCard";
import RepostCard from "@/components/feed/repost/RepostCard";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import LoaderStyled from "@/components/shared/LoaderStyled";
import { useGetPostsByUserId, useGetRepliedPostsByUserId, useGetSavedPostsByUserId } from "@/services/data/usePostData";

interface UserPostListProps {
    userId: ResId
    isReposts?: boolean
    isSavedPosts?: boolean
    isRepliedPosts?: boolean
}

const UserPostList: React.FC<UserPostListProps> = ({ userId, isReposts = false, isSavedPosts = false, isRepliedPosts = false }) => {

    const { data: posts, isLoading, isError, error } = isRepliedPosts ? useGetRepliedPostsByUserId(userId)
        : !isSavedPosts ? useGetPostsByUserId(userId) : useGetSavedPostsByUserId(userId);

    if (isLoading) return <LoaderStyled />;
    if (isError) return <ErrorComponent message={error.message} />;

    return posts?.content
        .filter(post => (!!post.repostId === isReposts))
        .map((post, index) => {
            if (isRepliedPosts) return <PostReplyCard post={post} userId={userId} />
            if (post.repostId === null) return <PostCard key={index} postId={post.id} />;
            return <RepostCard post={post} key={index} />
        });
}

export default UserPostList