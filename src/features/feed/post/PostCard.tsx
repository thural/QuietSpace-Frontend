import { PostResponse } from "@/api/schemas/inferred/post";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import { usePost } from "@/services/hook/feed/usePost";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import { isRepost } from "@/utils/typeUtils";
import PostCardView from "./PostCardView";

/**
 * Props for the PostCard component.
 * 
 * @interface PostCardProps
 * @extends GenericWrapper
 * @property {PostResponse} post - The post data object containing details of the post.
 * @property {boolean} [isBaseCard] - Flag to indicate if the card is a base card.
 * @property {boolean} [isMenuHidden] - Flag to control visibility of the post menu.
 */
export interface PostCardProps extends GenericWrapper {
    post: PostResponse;
    isBaseCard?: boolean;
    isMenuHidden?: boolean;
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
    let postData = undefined;
    try {
        if (isRepost(post)) throw new TypeError("object is not post");
        postData = usePost(post);
    } catch (error) {
        return <ErrorComponent message={(error as Error).message} />;
    }

    return <PostCardView post={post} isBaseCard={isBaseCard} isMenuHidden={isMenuHidden} postData={postData}>
        {children}
    </PostCardView>;
};

export default PostCard;