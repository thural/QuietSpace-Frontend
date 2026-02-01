import { PostResponse } from "@/features/feed/data/models/post";
import PostSkeleton from "@/shared/PostSkeleton";
import usePlaceholderCount from "@shared/hooks/usePlaceholderCount";
import { useIsFetching } from "@/core/hooks";
import RepostCard from "../repost/RepostCard";
import PostCard from "./PostCard";
import { useMemo } from "react";
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from "@/shared/components/base/BaseClassComponent";
import { ReactNode } from "react";

/**
 * Props for the PostListBox component.
 * 
 * @interface IPostListBoxProps
 * @property {Array<PostResponse>} posts - An array of post data objects to display.
 * @property {boolean} isLoading - Flag indicating if posts are currently being loaded.
 */
export interface IPostListBoxProps extends IBaseComponentProps {
    posts: Array<PostResponse>;
    isLoading: boolean;
}

/**
 * State for the PostListBox component.
 */
interface IPostListBoxState extends IBaseComponentState {
    isFetchingPosts: number;
    placeholders: number;
    postSkeletons: ReactNode[];
}

/**
 * PostListBox component.
 * 
 * This component renders a list of posts or skeletons while the posts are loading.
 * It uses the custom query hooks to check if any post fetching is in progress and
 * dynamically displays loading placeholders if necessary. Once the posts are loaded,
 * it distinguishes between regular posts and reposts, rendering them accordingly.
 * 
 * Converted to class-based component following enterprise patterns.
 */
class PostListBox extends BaseClassComponent<IPostListBoxProps, IPostListBoxState> {

    private placeholderHeight = 75;

    protected override getInitialState(): Partial<IPostListBoxState> {
        return {
            isFetchingPosts: 0,
            placeholders: 0,
            postSkeletons: []
        };
    }

    protected override onMount(): void {
        super.onMount();
        this.updateHooksState();
    }

    protected override onUpdate(): void {
        this.updateHooksState();
    }

    /**
     * Update state from hooks
     */
    private updateHooksState = (): void => {
        // Check if any post fetching is in progress using custom hooks
        const isFetchingPosts = useIsFetching();

        // Use a custom hook to determine the number of placeholders to display
        const placeholders = usePlaceholderCount(this.placeholderHeight);

        // Memoize the creation of post skeletons to improve performance
        const postSkeletons = useMemo(() =>
            Array.from({ length: placeholders })
                .map((_, index) => (<PostSkeleton key={index} />)),
            [isFetchingPosts, this.props.isLoading, placeholders]
        );

        this.safeSetState({
            isFetchingPosts,
            placeholders,
            postSkeletons
        });
    };

    protected override renderContent(): ReactNode {
        const { posts, isLoading } = this.props;
        const { isFetchingPosts, postSkeletons } = this.state;

        // If loading or fetching posts, return the skeletons
        if (isLoading || isFetchingPosts > 0) {
            return postSkeletons;
        }

        // Render the actual posts
        return posts.map((post, index) => {
            // Check if the post is a repost or a regular post
            if (!post.repost) {
                return <PostCard key={index} post={post} />;
            }
            return <RepostCard post={post} key={index} />;
        });
    }
}

export default PostListBox;