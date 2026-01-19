import { ResId } from "@/api/schemas/native/common";
import ErrorComponent from "@/shared/errors/ErrorComponent";
import PostSkeleton from "@/shared/PostSkeleton";
import { useGetPostById } from "@/services/data/usePostData";
import PostCard from "./PostCard";
import { GenericWrapper } from "@/types/sharedComponentTypes";

/**
 * Props for the PostLoader component.
 * 
 * @interface PostLoaderProps
 * @extends GenericWrapper
 * @property {ResId} postId - The ID of the post to load.
 * @property {boolean} [isMenuHidden] - Optional flag to control the visibility of the post menu.
 */
export interface PostLoaderProps extends GenericWrapper {
    postId: ResId;
    isMenuHidden?: boolean;
}

/**
 * PostLoader component.
 * 
 * This component is responsible for loading a post by its ID. It utilizes a custom hook
 * to fetch the post data and manages loading and error states. Depending on the state,
 * it displays a loading skeleton, an error message, or the actual PostCard component
 * containing the post details.
 * 
 * @param {PostLoaderProps} props - The component props.
 * @returns {JSX.Element} - The rendered PostLoader component, which may be a loading skeleton,
 *                          an error message, or the PostCard component.
 */
export const PostLoader: React.FC<PostLoaderProps> = ({ postId, isMenuHidden, children }) => {
    // Fetch the post data using the custom hook
    const { data: post, isLoading, isError, error } = useGetPostById(postId);

    // If post data is not available or still loading, return the loading skeleton
    if (post === undefined || isLoading) return <PostSkeleton />;

    // If there was an error fetching the post, return the error component
    if (isError) return <ErrorComponent message={error.message} />;

    // If post data is successfully fetched, return the PostCard with the post details
    return <PostCard post={post} isMenuHidden={isMenuHidden}>{children}</PostCard>;
}

export default PostLoader;