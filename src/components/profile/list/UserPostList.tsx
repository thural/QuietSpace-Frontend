import { ResId } from "@/api/schemas/native/common";
import PostCard from "@/features/feed/post/PostCard";
import PostReplyCard from "@/features/feed/post/PostReplyCard";
import RepostCard from "@/features/feed/repost/RepostCard";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import InfinateScrollContainer from "@/components/shared/InfinateScrollContainer";
import LoaderStyled from "@/components/shared/LoaderStyled";
import { useGetPostsByUserId, useGetRepliedPostsByUserId, useGetSavedPostsByUserId } from "@/services/data/usePostData";

/**
 * UserPostListProps interface.
 * 
 * This interface defines the props for the UserPostList component.
 * 
 * @property {ResId} userId - The ID of the user whose posts are being fetched.
 * @property {boolean} [isReposts=false] - Flag to indicate if only reposts should be displayed.
 * @property {boolean} [isSavedPosts=false] - Flag to indicate if only saved posts should be displayed.
 * @property {boolean} [isRepliedPosts=false] - Flag to indicate if only replied posts should be displayed.
 */
interface UserPostListProps {
    userId: ResId;
    isReposts?: boolean;
    isSavedPosts?: boolean;
    isRepliedPosts?: boolean;
}

/**
 * UserPostList component.
 * 
 * This component fetches and displays a list of posts for a specific user based on the provided flags.
 * It handles loading and error states, displaying appropriate components while data is being fetched.
 * The component uses conditional logic to determine which type of posts to fetch and how to render them.
 * 
 * @param {UserPostListProps} props - The component props.
 * @returns {JSX.Element} - The rendered UserPostList component.
 */
const UserPostList: React.FC<UserPostListProps> = ({
    userId,
    isReposts = false,
    isSavedPosts = false,
    isRepliedPosts = false
}) => {
    // Fetch posts based on the specified conditions
    const {
        data,
        isLoading,
        isError,
        error,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage
    } = isRepliedPosts
            ? useGetRepliedPostsByUserId(userId) // Fetch replied posts if isRepliedPosts is true
            : isSavedPosts
                ? useGetSavedPostsByUserId(userId) // Fetch saved posts if isSavedPosts is true
                : useGetPostsByUserId(userId); // Default to fetching regular posts

    // Show a loader while data is being fetched
    if (isLoading || !data) return <LoaderStyled />;

    // Display an error component if there was an error fetching data
    if (isError) return <ErrorComponent message={error.message} />;

    // Flatten the data structure to get an array of posts
    const content = data?.pages.flatMap((page) => page.content);

    return (
        <InfinateScrollContainer
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
        >
            {content
                .filter(post => (!!post.repostId === isReposts)) // Filter posts based on the isReposts flag
                .map((post, index) => {
                    // Render different components based on the post type
                    if (isRepliedPosts) {
                        return <PostReplyCard post={post} userId={userId} key={index} />;
                    }
                    if (!post.repostId) {
                        return <PostCard key={index} post={post} />;
                    }
                    return <RepostCard post={post} key={index} />;
                })}
        </InfinateScrollContainer>
    );
}

export default UserPostList;