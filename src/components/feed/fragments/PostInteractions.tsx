import { PostResponse } from "@/api/schemas/inferred/post";
import FlexStyled from "@/components/shared/FlexStyled";
import { ConsumerFn } from "@/types/genericTypes";
import CommentToggle from "./CommentToggle";
import DislikeToggle from "./DislikeToggle";
import LikeToggle from "./LikeToggle";
import PostStats from "./PostStats";
import ShareMenu from "./ShareMenu";
import useStyles from "@/styles/feed/postInteractionStyles";

interface PostInteractionsProps {
    post: PostResponse
    commentCount: number
    hasCommented: boolean
    handleLike: ConsumerFn
    handleDislike: ConsumerFn
    toggleShareForm: ConsumerFn
    toggleCommentForm: ConsumerFn
    toggleRepostForm: ConsumerFn
}

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

export default PostInteractions