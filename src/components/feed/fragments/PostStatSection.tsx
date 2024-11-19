import { Post } from "@/api/schemas/inferred/post";
import BoxStyled from "@/components/shared/BoxStyled";
import { ConsumerFn } from "@/types/genericTypes";
import ShareMenu from "./ShareMenu";
import CommentToggle from "./CommentToggle";
import DislikeToggle from "./DislikeToggle";
import LikeToggle from "./LikeToggle";
import PostStats from "./PostStats";

interface PostStatSectionProps {
    post: Post
    commentCount: number
    hasCommented: boolean
    handleLike: ConsumerFn
    handleDislike: ConsumerFn
    toggleShareForm: ConsumerFn
    toggleCommentForm: ConsumerFn
    toggleRepostForm: ConsumerFn
}

const style = {
    gap: '.5rem',
    height: '1.5rem',
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'start',
    alignItems: 'center',
    fontSize: '1.3rem',
    margin: '1rem 0'
}

const PostStatSection: React.FC<PostStatSectionProps> = ({
    post,
    commentCount,
    hasCommented,
    handleLike,
    handleDislike,
    toggleShareForm,
    toggleCommentForm,
    toggleRepostForm
}) => (
    <BoxStyled style={style}>
        <LikeToggle userReaction={post?.userReaction} handleLike={handleLike} />
        <DislikeToggle userReaction={post?.userReaction} handleDislike={handleDislike} />
        <CommentToggle hasCommented={hasCommented} toggleForm={toggleCommentForm} />
        <ShareMenu handleShareClick={toggleShareForm} handleRepostClick={toggleRepostForm} />
        <PostStats post={post} commentCount={commentCount} />
    </BoxStyled>
);

export default PostStatSection