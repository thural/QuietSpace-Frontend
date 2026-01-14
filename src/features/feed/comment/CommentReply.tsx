import { CommentResponse } from "@/api/schemas/inferred/comment";
import BoxStyled from "@/components/shared/BoxStyled";
import EmojiText from "@/components/shared/EmojiText";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import FlexStyled from "@/components/shared/FlexStyled";
import Overlay from "@/components/shared/Overlay";
import Typography from "@/components/shared/Typography";
import UserAvatarPhoto from "@/components/shared/UserAvatarPhoto";
import useComment from "@/services/hook/feed/useComment";
import styles from "@/styles/feed/commentStyles";
import CreateCommentForm from "../form/CreateCommentForm";
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
        <BoxStyled key={comment.id} className={classes.comment} style={appliedStyle}>
            <BoxStyled className={classes.commentBody}>
                <FlexStyled className={classes.replyCard}>
                    <BoxStyled className="reply-card-indicator"></BoxStyled>
                    <Typography className="reply-card-text" lineClamp={1}>{repliedComment?.text}</Typography>
                </FlexStyled>
                <EmojiText text={comment.text} />
            </BoxStyled>
            <CommentControls
                isOwner={isOwner}
                isLiked={isLiked}
                handleLike={handleLikeToggle}
                handleReply={toggleCommentForm}
                hanldeDelete={handleDeleteComment}
            />
        </BoxStyled>
    );

    return (
        <FlexStyled className={classes.commentWrapper}>
            <CommentBody />
            <UserAvatarPhoto userId={user.id} />
            <Overlay onClose={toggleCommentForm} isOpen={commentFormView}>
                <CreateCommentForm postItem={comment} />
            </Overlay>
        </FlexStyled>
    );
};

export default CommentReply;