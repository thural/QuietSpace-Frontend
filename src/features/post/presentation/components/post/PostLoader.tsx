import { ResId } from "@/shared/api/models/commonNative";
import ErrorComponent from "@/shared/errors/ErrorComponent";
import PostSkeleton from "@/shared/PostSkeleton";
import { useGetPostById } from "@features/feed/data";
import PostCard from "./PostCard";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from "@/shared/components/base/BaseClassComponent";
import { ReactNode } from "react";

/**
 * Props for the PostLoader component.
 * 
 * @interface IPostLoaderProps
 * @extends GenericWrapper
 * @property {ResId} postId - The ID of the post to load.
 * @property {boolean} [isMenuHidden] - Optional flag to control the visibility of the post menu.
 */
export interface IPostLoaderProps extends IBaseComponentProps, GenericWrapper {
    postId: ResId;
    isMenuHidden?: boolean;
}

/**
 * State for the PostLoader component.
 */
interface IPostLoaderState extends IBaseComponentState {
    post: any;
    isLoading: boolean;
    isError: boolean;
    error: any;
}

/**
 * PostLoader component.
 * 
 * This component is responsible for loading a post by its ID. It utilizes a custom hook
 * to fetch the post data and manages loading and error states. Depending on the state,
 * it displays a loading skeleton, an error message, or the actual PostCard component
 * containing the post details.
 * 
 * Converted to class-based component following enterprise patterns.
 */
class PostLoader extends BaseClassComponent<IPostLoaderProps, IPostLoaderState> {

    private postHook: any;

    protected override getInitialState(): Partial<IPostLoaderState> {
        return {
            post: undefined,
            isLoading: true,
            isError: false,
            error: null
        };
    }

    protected override onMount(): void {
        super.onMount();
        // Initialize hook
        this.postHook = useGetPostById(this.props.postId);
        this.updatePostState();
    }

    protected override onUpdate(): void {
        this.updatePostState();
    }

    /**
     * Update post state from hook
     */
    private updatePostState = (): void => {
        if (this.postHook) {
            const { data: post, isLoading, isError, error } = this.postHook;
            this.safeSetState({
                post,
                isLoading,
                isError,
                error
            });
        }
    };

    protected override renderContent(): ReactNode {
        const { isMenuHidden, children } = this.props;
        const { post, isLoading, isError, error } = this.state;

        // If post data is not available or still loading, return the loading skeleton
        if (post === undefined || isLoading) return <PostSkeleton />;

        // If there was an error fetching the post, return the error component
        if (isError) return <ErrorComponent message={error?.message} />;

        // If post data is successfully fetched, return the PostCard with the post details
        return <PostCard post={post} isMenuHidden={isMenuHidden}>{children}</PostCard>;
    }
}

export default PostLoader;