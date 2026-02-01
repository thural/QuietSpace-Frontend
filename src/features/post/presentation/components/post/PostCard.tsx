import { PostResponse } from "../../../data/models/post";
import PostCardView from "./PostCardView";
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from "@/shared/components/base/BaseClassComponent";
import { ReactNode } from "react";

/**
 * Props for the PostCard component.
 * 
 * @interface IPostCardProps
 * @property {PostResponse} post - The post data object containing details of the post.
 * @property {boolean} [isBaseCard] - Flag to indicate if the card is a base card.
 * @property {boolean} [isMenuHidden] - Flag to control visibility of the post menu.
 * @property {React.ReactNode} [children] - Child components to render inside the card.
 */
export interface IPostCardProps extends IBaseComponentProps {
    post: PostResponse;
    isBaseCard?: boolean;
    isMenuHidden?: boolean;
    children?: React.ReactNode;
}

/**
 * State for the PostCard component.
 */
interface IPostCardState extends IBaseComponentState {
    // No additional state needed
}

/**
 * PostCard component.
 * 
 * This component renders a card for displaying a post, including its content, header,
 * interactions, and various forms for editing, commenting, reposting, and sharing.
 * It handles error states when retrieving post data and manages the visibility of overlays
 * for different forms.
 * 
 * Converted to class-based component following enterprise patterns.
 */
class PostCard extends BaseClassComponent<IPostCardProps, IPostCardState> {

    protected override getInitialState(): Partial<IPostCardState> {
        return {};
    }

    protected override renderContent(): ReactNode {
        const { post, isBaseCard = false, isMenuHidden = false, children } = this.props;

        // TODO: Implement proper error handling when ErrorComponent is available
        if (!post) {
            return <div>Error: Post data is missing</div>;
        }

        // TODO: Implement post data processing when isRepost utility is available
        const postData = post; // Temporary fix

        return (
            <PostCardView
                post={post}
                isBaseCard={isBaseCard}
                isMenuHidden={isMenuHidden}
                postData={postData}
            >
                {children}
            </PostCardView>
        );
    }
}

export default PostCard;