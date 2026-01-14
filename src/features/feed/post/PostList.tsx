import { PostResponse } from "@/api/schemas/inferred/post";
import PostSkeleton from "@/components/shared/PostSkeleton";
import usePlaceholderCount from "@/services/hook/shared/usePlaceholderCount";
import { useIsFetching } from "@tanstack/react-query";
import RepostCard from "../repost/RepostCard";
import PostCard from "./PostCard";
import { useMemo } from "react";

/**
 * Props for the PostListBox component.
 * 
 * @interface PostListBoxProps
 * @property {Array<PostResponse>} posts - An array of post data objects to display.
 * @property {boolean} isLoading - Flag indicating if posts are currently being loaded.
 */
interface PostListBoxProps {
    posts: Array<PostResponse>;
    isLoading: boolean;
}

/**
 * PostListBox component.
 * 
 * This component renders a list of posts or skeletons while the posts are loading.
 * It uses the React Query library to check if any post fetching is in progress and
 * dynamically displays loading placeholders if necessary. Once the posts are loaded,
 * it distinguishes between regular posts and reposts, rendering them accordingly.
 * 
 * @param {PostListBoxProps} props - The component props.
 * @returns {JSX.Element | JSX.Element[]} - The rendered PostListBox component, which can be an array of post elements or loading skeletons.
 */
const PostListBox: React.FC<PostListBoxProps> = ({ posts, isLoading }) => {

    // Check if any post fetching is in progress using React Query
    const isFetchingPosts = useIsFetching({ queryKey: ['posts'] });

    // Define a constant for the height of the placeholders
    const placeholderHeight = 75;

    // Use a custom hook to determine the number of placeholders to display
    const placeholders = usePlaceholderCount(placeholderHeight);

    // Memoize the creation of post skeletons to improve performance
    const postSkeletons = useMemo(() =>
        Array.from({ length: placeholders })
            .map((_, index) => (<PostSkeleton key={index} />)),
        [isFetchingPosts, isLoading, placeholders]
    );

    // If loading or fetching posts, return the skeletons
    if (isLoading || isFetchingPosts > 0) {
        return postSkeletons;
    };

    // Render the actual posts
    return posts.map((post, index) => {
        // Check if the post is a repost or a regular post
        if (!post.repost) {
            return <PostCard key={index} post={post} />;
        }
        return <RepostCard post={post} key={index} />;
    });
};

export default PostListBox;