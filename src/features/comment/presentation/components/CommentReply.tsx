import { CommentResponse } from "@/features/feed/data/models/comment";
import { Container } from '@/shared/ui/components/layout/Container';
import { FlexContainer } from '@/shared/ui/components/layout/FlexContainer';
import { CommentCard } from '@/shared/ui/components/social';
import type { ICommentCardProps } from '@/shared/ui/components/social';
import ErrorComponent from "@/shared/errors/ErrorComponent";
import Overlay from "@/shared/Overlay";
import Typography from "@/shared/Typography";
import UserAvatarPhoto from "@/shared/UserAvatarPhoto";
import useComment from "@features/feed/application/hooks/useComment";
import CreateCommentForm from "../forms/CreateCommentForm";

/**
 * Props for the CommentReply component.
 *
 * @interface CommentReplyProps
 * @property {CommentResponse} comment - The reply comment data.
 * @property {CommentResponse | undefined} repliedComment - The comment being replied to.
 */
interface CommentReplyProps {
    comment: CommentResponse;
    repliedComment: CommentResponse | undefined;
}

/**
 * CommentReply component that displays a reply to a comment.
 *
 * It fetches comment data and handles rendering the reply, along with controls for liking, replying, and deleting.
 *
 * @param {CommentReplyProps} props - The props for the CommentReply component.
 * @returns {JSX.Element} - The rendered comment reply component.
 */
const CommentReply: React.FC<CommentReplyProps> = ({ comment, repliedComment }) => {

    let data;

    try {
        data = useComment(comment);
    } catch (error: unknown) {
        console.error(error as Error);
        return <ErrorComponent message={(error as Error).message} />;
    }

    const {
        user,
        isOwner,
        appliedStyle,
        handleDeleteComment,
        handleLikeToggle,
        toggleCommentForm,
        commentFormView,
        isLiked,
    } = data;

    // Convert comment data to CommentCard props
    const commentCardProps: ICommentCardProps = {
        content: comment.text,
        author: {
            name: user.name,
            ...(user.avatar && { avatar: user.avatar }),
        },
        timestamp: new Date(comment.createDate || comment.updateDate || Date.now()).toLocaleString(),
        isReply: !!repliedComment,
        onReply: () => toggleCommentForm(),
        onLike: () => handleLikeToggle(),
        onDelete: () => handleDeleteComment(),
        likes: comment.likeCount || 0,
        isLiked: isLiked,
        showActions: true,
        variant: 'default',
    };

    const CommentBody = () => (
        <Container key={comment.id} style={appliedStyle}>
            <Container className="comment-body">
                {repliedComment && (
                    <FlexContainer className="reply-card">
                        <Container className="reply-card-indicator"></Container>
                        <Typography className="reply-card-text" lineClamp={1}>{repliedComment.text}</Typography>
                    </FlexContainer>
                )}
                <CommentCard {...commentCardProps} />
            </Container>
        </Container>
    );

    return (
        <FlexContainer className="comment-wrapper">
            <CommentBody />
            <UserAvatarPhoto userId={user.id} />
            <Overlay onClose={toggleCommentForm} isOpen={commentFormView}>
                <CreateCommentForm postItem={comment} />
            </Overlay>
        </FlexContainer>
    );
};

export default CommentReply;