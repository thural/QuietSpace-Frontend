import { CommentResponse } from "@/features/feed/data/models/comment";
import { Container } from '@/shared/ui/components/layout/Container';
import { FlexContainer } from '@/shared/ui/components/layout/FlexContainer';
import EmojiText from "@/shared/EmojiText";
import ErrorComponent from "@/shared/errors/ErrorComponent";
import Overlay from "@/shared/Overlay";
import Typography from "@/shared/Typography";
import UserAvatarPhoto from "@/shared/UserAvatarPhoto";
import useComment from "@features/feed/application/hooks/useComment";
import styles from "../../styles/commentStyles";
import CreateCommentForm from "../forms/CreateCommentForm";
import CommentControls from "./CommentControls";

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
    const classes = styles(true);

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

    const CommentBody = () => (
        <Container key={comment.id} className={classes.comment} style={appliedStyle}>
            <Container className={classes.commentBody}>
                <FlexContainer className={classes.replyCard}>
                    <Container className="reply-card-indicator"></Container>
                    <Typography className="reply-card-text" lineClamp={1}>{repliedComment?.text}</Typography>
                </FlexContainer>
                <EmojiText text={comment.text} />
            </Container>
            <CommentControls
                isOwner={isOwner}
                isLiked={isLiked}
                handleLike={handleLikeToggle}
                handleReply={toggleCommentForm}
                hanldeDelete={handleDeleteComment}
            />
        </Container>
    );

    return (
        <FlexContainer className={classes.commentWrapper}>
            <CommentBody />
            <UserAvatarPhoto userId={user.id} />
            <Overlay onClose={toggleCommentForm} isOpen={commentFormView}>
                <CreateCommentForm postItem={comment} />
            </Overlay>
        </FlexContainer>
    );
};

export default CommentReply;