import { Comment } from "@/api/schemas/inferred/comment";
import BoxStyled from "@/components/shared/BoxStyled";
import EmojiText from "@/components/shared/EmojiText";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import FlexStyled from "@/components/shared/FlexStyled";
import Overlay from "@/components/shared/Overlay";
import Typography from "@/components/shared/Typography";
import UserAvatar from "@/components/shared/UserAvatar";
import useComment from "@/services/hook/feed/useComment";
import styles from "@/styles/feed/commentStyles";
import { toUpperFirstChar } from "@/utils/stringUtils";
import CreateCommentForm from "../form/CreateCommentForm";
import CommentControls from "./CommentControls";

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
        isOwner,
        appliedStyle,
        handleDeleteComment,
        handleLikeToggle,
        toggleCommentForm,
        commentFormView,
        isLiked,
    } = data;



    const CommentBody = () => (
        <FlexStyled key={comment.id} className={classes.comment} style={appliedStyle}>
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
        </FlexStyled>
    );

    return (
        <FlexStyled className={classes.commentWrapper}>
            <CommentBody />
            <UserAvatar chars={toUpperFirstChar(user.username)} />
            <Overlay onClose={toggleCommentForm} isOpen={commentFormView}>
                <CreateCommentForm postItem={comment} />
            </Overlay>
        </FlexStyled>
    );
};

export default CommentReply