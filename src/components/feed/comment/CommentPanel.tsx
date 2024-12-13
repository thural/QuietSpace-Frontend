import { ResId } from "@/api/schemas/native/common";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import FlexStyled from "@/components/shared/FlexStyled";
import LoaderStyled from "@/components/shared/LoaderStyled";
import { useGetComments } from "@/services/data/useCommentData";
import styles from "@/styles/feed/commentPanelStyles";
import CommentBox from "./Comment";
import CommentReply from "./CommentReply";

/**
 * Props for the CommentPanel component.
 *
 * @interface CommentPanelProps
 * @property {ResId | undefined} postId - The ID of the post for which to display comments. Can be undefined.
 */
interface CommentPanelProps {
    postId: ResId | undefined;
}

/**
 * CommentPanel component that fetches and displays comments for a specific post.
 *
 * The component first checks if the postId is defined; if not, it returns null.
 * It uses the `useGetComments` hook to fetch comments associated with the postId.
 * If the comments are loading, it displays a loader. If there's an error, it displays an error message.
 *
 * The `CommentList` inner function maps over the fetched comments:
 * - It renders `CommentBox` for top-level comments (those without a parentId).
 * - For replies (comments with a parentId), it finds the parent comment and renders `CommentReply`.
 *
 * @param {CommentPanelProps} props - The props for the CommentPanel component.
 * @returns {JSX.Element | null} - The rendered comment panel or null if postId is undefined.
 */
const CommentPanel: React.FC<CommentPanelProps> = ({ postId }) => {
    const classes = styles();

    // If postId is undefined, return null
    if (postId === undefined) return null;

    // Fetch comments for the given postId
    const comments = useGetComments(postId);

    // Show loading indicator while comments are being fetched
    if (comments.isLoading) return <LoaderStyled />;

    // Show error component if there was an error fetching comments
    if (comments.isError) return <ErrorComponent message="could not load comments" />;

    /**
     * CommentList inner function that renders the list of comments.
     *
     * @returns {JSX.Element | null} - The rendered list of comments or null if there are no comments.
     */
    const CommentList = () => {
        // If there are no comments, return null
        if (comments.data?.totalElements === 0) return null;

        // Render the comments
        return (
            <>
                {comments.data?.content.map((comment, index) => {
                    // Render top-level comments
                    if (!comment.parentId) return <CommentBox key={index} comment={comment} />;
                    // Find the parent comment for replies
                    const repliedComment = comments.data.content.find(c => c.id === comment.parentId);
                    // Render replies
                    return <CommentReply key={index} comment={comment} repliedComment={repliedComment} />;
                })}
            </>
        );
    };

    return (
        <FlexStyled className={classes.commentSection}>
            <CommentList />
        </FlexStyled>
    );
}

export default CommentPanel;