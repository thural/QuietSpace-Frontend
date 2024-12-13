import { PostResponse } from "@/api/schemas/inferred/post";
import FlexStyled from "@/components/shared/FlexStyled";
import { ConsumerFn } from "@/types/genericTypes";
import CommentToggle from "./CommentToggle";
import DislikeToggle from "./DislikeToggle";
import LikeToggle from "./LikeToggle";
import PostStats from "./PostStats";
import ShareMenu from "./ShareMenu";
import useStyles from "@/styles/feed/postInteractionStyles";

/**
 * Props for the PostInteractions component.
 * 
 * @interface PostInteractionsProps
 * @property {PostResponse} post - The post data object containing the post's details and user reactions.
 * @property {number} commentCount - The total number of comments on the post.
 * @property {boolean} hasCommented - Indicates whether the user has commented on the post.
 * @property {ConsumerFn} handleLike - Function to handle the like action.
 * @property {ConsumerFn} handleDislike - Function to handle the dislike action.
 * @property {ConsumerFn} toggleShareForm - Function to toggle the share form visibility.
 * @property {ConsumerFn} toggleCommentForm - Function to toggle the comment form visibility.
 * @property {ConsumerFn} toggleRepostForm - Function to toggle the repost form visibility.
 */
interface PostInteractionsProps {
    post: PostResponse;
    commentCount: number;
    hasCommented: boolean;
    handleLike: ConsumerFn;
    handleDislike: ConsumerFn;
    toggleShareForm: ConsumerFn;
    toggleCommentForm: ConsumerFn;
    toggleRepostForm: ConsumerFn;
}

/**
 * PostInteractions component.
 * 
 * This component displays interactive elements related to a post, including like, dislike,
 * comment toggles, share menu, and post statistics. It provides functionality for users to
 * interact with the post and view related data.
 * 
 * @param {PostInteractionsProps} props - The component props.
 * @returns {JSX.Element} - The rendered PostInteractions component.
 */
const PostInteractions: React.FC<PostInteractionsProps> = ({
    post,
    commentCount,
    hasCommented,
    handleLike,
    handleDislike,
    toggleShareForm,
    toggleCommentForm,
    toggleRepostForm
}) => {
    const classes = useStyles();

    return (
        <FlexStyled className={classes.statsSection}>
            <LikeToggle userReaction={post?.userReaction} handleLike={handleLike} />
            <DislikeToggle userReaction={post?.userReaction} handleDislike={handleDislike} />
            <CommentToggle hasCommented={hasCommented} toggleForm={toggleCommentForm} />
            <ShareMenu handleShareClick={toggleShareForm} handleRepostClick={toggleRepostForm} />
            <PostStats post={post} commentCount={commentCount} />
        </FlexStyled>
    );
}

export default PostInteractions;