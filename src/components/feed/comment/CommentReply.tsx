import { Comment } from "@/api/schemas/inferred/comment";
import BoxStyled from "@/components/shared/BoxStyled";
import Conditional from "@/components/shared/Conditional";
import EmojiText from "@/components/shared/EmojiText";
import FlexStyled from "@/components/shared/FlexStyled";
import Typography from "@/components/shared/Typography";
import UserAvatar from "@/components/shared/UserAvatar";
import { toUpperFirstChar } from "@/utils/stringUtils";
import useComment from "@/services/hook/feed/useComment";
import styles from "@/styles/feed/commenReplytStyles";
import Overlay from "@/components/shared/Overlay";
import CreateCommentForm from "../form/CreateCommentForm";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";

interface CommentReplyProps {
    comment: Comment
    repliedComment: Comment | undefined
}

const CommentReply: React.FC<CommentReplyProps> = ({ comment, repliedComment }) => {

    const classes = styles();

    let data = undefined;

    try {
        data = useComment(comment);
    } catch (error: unknown) {
        console.error(error as Error);
        return <ErrorComponent message={(error as Error).message} />;
    }

    const {
        user,
        handleDeleteComment,
        handleLikeToggle,
        toggleCommentForm,
        commentFormView,
        isLiked,
    } = data;

    const appliedStyle = {
        borderRadius: '1rem 0rem 1rem 1rem',
        marginLeft: 'auto'
    };

    const CommentBody = () => (
        <BoxStyled key={comment.id} className={classes.comment} style={appliedStyle}>
            <BoxStyled className={classes.commentBody}>
                <FlexStyled className={classes.replyCard}>
                    <BoxStyled className="reply-card-indicator"></BoxStyled>
                    <Typography className="reply-card-text" lineClamp={1}>{repliedComment?.text}</Typography>
                </FlexStyled>
                <EmojiText text={comment.text} />
            </BoxStyled>
            <BoxStyled className={classes.commentOptions}>
                <Typography className="comment-like" onClick={handleLikeToggle}>{isLiked ? "unlike" : "like"}</Typography>
                <Typography className="comment-reply" onClick={toggleCommentForm}>reply</Typography>
                <Typography className="comment-reply-count">{comment.replyCount}</Typography>
                <Conditional isEnabled={comment.username === user.username}>
                    <Typography className="comment-delete" onClick={handleDeleteComment}>delete</Typography>
                </Conditional>
            </BoxStyled>
        </BoxStyled>
    );

    return (
        <FlexStyled className={classes.wrapper}>
            <CommentBody />
            <UserAvatar chars={toUpperFirstChar(user.username)} />
            <Overlay onClose={toggleCommentForm} isOpen={commentFormView}>
                <CreateCommentForm postItem={comment} />
            </Overlay>
        </FlexStyled>
    );
};

export default CommentReply