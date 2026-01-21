import { PostResponse } from "@/features/feed/data/models/post";
import { ResId } from "@/shared/api/models/commonNative";
import PostCard from "./PostCard";
import ErrorComponent from "@/shared/errors/ErrorComponent";
import PostSkeleton from "@/shared/PostSkeleton";
import { useGetLatestComment } from "@features/feed/data/useCommentData";
import { useGetUserById } from "@/services/data/useUserData";
import CommentBox from "../comment/Comment";

/**
 * Props for the PostReplyCard component.
 * 
 * @interface PostReplyCardProps
 * @property {PostResponse} post - The post data object that the reply is associated with.
 * @property {ResId} userId - The ID of the user who made the comment.
 */
interface PostReplyCardProps {
    post: PostResponse;
    userId: ResId;
}

/**
 * PostReplyCard component.
 * 
 * This component fetches and displays a post alongside its latest comment from a specific user.
 * It handles loading and error states by rendering a skeleton loader during data fetching,
 * and an error component if there are issues with fetching the user or comment data. 
 * Once the data is successfully loaded, it displays the post and comment.
 * 
 * @param {PostReplyCardProps} props - The component props.
 * @returns {JSX.Element} - The rendered PostReplyCard component, which may show a loading skeleton,
 *                          an error message, or the post and comment.
 */
const PostReplyCard: React.FC<PostReplyCardProps> = ({ post, userId }) => {
    let userData = undefined;
    let commentData = undefined;

    try {
        // Validate the presence of userId and post
        if (!userId) throw new Error("userId is undefined");
        if (!post) throw new Error("post is undefined");

        // Fetch user data and the latest comment using custom hooks
        userData = useGetUserById(userId);
        commentData = useGetLatestComment(userId, post.id);

        // Check for errors in fetching user or comment data
        if (userData.isError) throw userData.error;
        if (commentData.isError) throw commentData.error;
    } catch (error) {
        // Render an error component if an error occurs
        return <ErrorComponent message={(error as Error).message} />;
    }

    const { data: user, isLoading: isUserLoading } = userData;
    const { data: comment, isLoading: isCommentLoading } = commentData;

    // Render a skeleton loader while fetching data
    if (isCommentLoading || isUserLoading || !user || !comment) return <PostSkeleton />;

    // Render the PostCard and CommentBox once data is loaded
    return (
        <>
            <PostCard post={post} isMenuHidden={true} />
            <CommentBox comment={comment} />
        </>
    );
}

export default PostReplyCard;