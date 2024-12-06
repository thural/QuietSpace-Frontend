import { ResId } from "@/api/schemas/native/common";
import PostCard from "@/components/feed/post/PostCard";
import PostReplyCard from "@/components/feed/post/PostReplyCard";
import RepostCard from "@/components/feed/repost/RepostCard";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import InfinateScrollContainer from "@/components/shared/InfinateScrollContainer";
import LoaderStyled from "@/components/shared/LoaderStyled";
import { useGetPostsByUserId, useGetRepliedPostsByUserId, useGetSavedPostsByUserId } from "@/services/data/usePostData";

interface UserPostListProps {
    userId: ResId
    isReposts?: boolean
    isSavedPosts?: boolean
    isRepliedPosts?: boolean
}

const UserPostList: React.FC<UserPostListProps> = ({ userId, isReposts = false, isSavedPosts = false, isRepliedPosts = false }) => {

    const {
        data,
        isLoading,
        isError,
        error,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage
    } = isRepliedPosts ? useGetRepliedPostsByUserId(userId)
            : !isSavedPosts ? useGetPostsByUserId(userId)
                : useGetSavedPostsByUserId(userId);


    if (isLoading || !data) return <LoaderStyled />;
    if (isError) return <ErrorComponent message={error.message} />;
    const content = data?.pages.flatMap((page) => page.content);


    return (
        <InfinateScrollContainer
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
        >
            {content
                .filter(post => (!!post.repostId === isReposts))
                .map((post, index) => {
                    if (isRepliedPosts) return <PostReplyCard post={post} userId={userId} key={index} />;
                    if (!post.repostId) return <PostCard key={index} post={post} />;
                    return <RepostCard post={post} key={index} />;
                })}
        </InfinateScrollContainer>
    )
}

export default UserPostList