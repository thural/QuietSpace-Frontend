/**
 * PostResults Component.
 * 
 * Displays search results for posts based on the search query.
 * Handles loading, error, and success states appropriately.
 */

import { PostResponse, PostList, PostPage } from "@/features/feed/data/models/post";
import PostCard from "@/features/feed/presentation/components/post/PostCard";
import { LoadingSpinner } from "@/shared/ui/components";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import Typography from "@/shared/Typography";
import { useEnterpriseSearch } from "@search/application/hooks/useEnterpriseSearch";

/**
 * PostResultsProps interface.
 * 
 * This interface defines the props for the PostResults component.
 * 
 * @property {PostList} postQueryList - A list of posts to be displayed.
 * @property {UseMutationResult<PostPage, Error, string>} fetchPostQuery - The mutation result containing the status of the post fetching operation.
 */
export interface PostResultsProps extends GenericWrapper {
    postQueryList: PostList;
    isLoading: boolean;
    error: Error | null;
}

/**
 * PostResults component.
 * 
 * This component handles the display of a list of posts based on the fetching status.
 * It conditionally renders a loading indicator, an error message, or the list of posts.
 * 
 * @param {PostResultsProps} props - The component props.
 * @returns {JSX.Element} - The rendered PostResults component based on the fetching state.
 */
const PostResults: React.FC<PostResultsProps> = ({ isLoading, error, postQueryList }) => (
    // Check if the fetch operation is pending
    isLoading ? (
        <LoadingSpinner size="md" /> // Show loader while data is being fetched
    ) : error ? (
        // Check if there was an error in the fetch operation
        <Typography type="h1">{error.message}</Typography> // Display error message
    ) : (
        // Render the list of posts if fetching is successful
        postQueryList?.map((post: PostResponse, index: number) => (
            <PostCard key={index} post={post} /> // Render each post using PostCard component
        ))
    )
);

export default PostResults;
