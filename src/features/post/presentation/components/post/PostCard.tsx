import { PostResponse } from "../../../data/models/post";
import PostCardView from "./PostCardView";

/**
 * Props for the PostCard component.
 * 
 * @interface PostCardProps
 * @property {PostResponse} post - The post data object containing details of the post.
 * @property {boolean} [isBaseCard] - Flag to indicate if the card is a base card.
 * @property {boolean} [isMenuHidden] - Flag to control visibility of the post menu.
 * @property {React.ReactNode} [children] - Child components to render inside the card.
 */
export interface PostCardProps {
    post: PostResponse;
    isBaseCard?: boolean;
    isMenuHidden?: boolean;
    children?: React.ReactNode;
}

/**
 * PostCard component.
 * 
 * This component renders a card for displaying a post, including its content, header,
 * interactions, and various forms for editing, commenting, reposting, and sharing.
 * It handles error states when retrieving post data and manages the visibility of overlays
 * for different forms.
 * 
 * @param {PostCardProps} props - The component props.
 * @returns {JSX.Element} - The rendered PostCard component.
 */
const PostCard: React.FC<PostCardProps> = ({ post, isBaseCard = false, isMenuHidden = false, children }) => {
    // TODO: Implement proper error handling when ErrorComponent is available
    if (!post) {
        return <div>Error: Post data is missing</div>;
    }

    // TODO: Implement post data processing when isRepost utility is available
    const postData = post; // Temporary fix

    return <PostCardView post={post} isBaseCard={isBaseCard} isMenuHidden={isMenuHidden} postData={postData}>
        {children}
    </PostCardView>;
};

export default PostCard;