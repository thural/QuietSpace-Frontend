import DefaultContainer from "@/shared/DefaultContainer";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import { useParams } from "react-router-dom";
import CommentPanel from "./comment/CommentPanel";
import PostLoader from "./post/PostLoader";
import { validateIsNotUndefined } from "@/utils/validations";

/**
 * PostContainer component.
 * 
 * This component serves as a container for displaying a specific post along with its comments.
 * It retrieves the post ID from the URL parameters, validates it, and uses the PostLoader component 
 * to fetch and display the post details. The CommentPanel is nested within the PostLoader,
 * allowing users to view and interact with comments related to the post.
 * 
 * @returns {JSX.Element} - The rendered PostContainer component, which includes the post loader 
 *                          and the comment panel.
 */
const PostContainer: React.FC<GenericWrapper> = () => {

    // Retrieve the post ID from the URL parameters
    const { postId } = useParams();

    // Validate that the post ID is defined
    const { postId: validPostId } = validateIsNotUndefined({ postId });

    return (
        <DefaultContainer>
            {/* Load the post data and render the CommentPanel */}
            <PostLoader postId={validPostId}>
                <CommentPanel postId={postId} />
            </PostLoader>
        </DefaultContainer>
    );
}

export default withErrorBoundary(PostContainer);