import { toUpperFirstChar } from "@/utils/stringUtils";
import styles from "./styles/commenReplytStyles";
import useRepliedComment from "./hooks/useRepliedComment";
import BoxStyled from "@/components/shared/BoxStyled";
import FlexStyled from "@/components/shared/FlexStyled";
import Typography from "@/components/shared/Typography";
import EmojiText from "@/components/shared/EmojiText";
import UserAvatar from "@/components/shared/UserAvatar";
import { CommentBody, CommentSchema } from "@/api/schemas/comment";

interface CommentReplyProps {
    comment: CommentSchema
    repliedComment: CommentBody
}

const CommentReply: React.FC<CommentReplyProps> = ({ comment, repliedComment }) => {

    const classes = styles();
    const { user, handleDeleteComment, handleReaction } = useRepliedComment(comment);

    const appliedStyle = {
        borderRadius: '1rem 0rem 1rem 1rem',
        marginLeft: 'auto'
    };

    const CommentBody = () => (
        <BoxStyled key={comment.id} className={classes.comment} style={appliedStyle}>
            <FlexStyled className={classes.replyCard}>
                <BoxStyled className="reply-card-indicator"></BoxStyled>
                <Typography className="reply-card-text" lineClamp={1}>{repliedComment.text}</Typography>
            </FlexStyled>
            <EmojiText text={comment.text} />
        </BoxStyled>
    );

    return (
        <FlexStyled className={classes.wrapper}>
            <CommentBody />
            <UserAvatar chars={toUpperFirstChar(user.username)} />
        </FlexStyled>
    );
};

export default CommentReply;