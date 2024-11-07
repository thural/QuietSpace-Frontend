import BoxStyled from "@components/shared/BoxStyled";
import Conditional from "@components/shared/Conditional";
import EmojiText from "@components/shared/EmojiText";
import FlexStyled from "@components/shared/FlexStyled";
import Typography from "@components/shared/Typography";
import UserAvatar from "@components/shared/UserAvatar";
import { toUpperFirstChar } from "@/utils/stringUtils";
import styles from "./styles/commentStyles";
import useComment from "./hooks/useComment";
import { Comment } from "@/api/schemas/inferred/comment";
import Overlay from "@/components/shared/Overlay/Overlay";
import CreateCommentForm from "../../form/comment/CreateCommentForm";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";

interface CommentProps extends GenericWrapper {
    comment: Comment
    repliedComment?: Comment
}

const CommentBox: React.FC<CommentProps> = ({ comment, repliedComment }) => {

    const classes = styles();

    const {
        user,
        handleDeleteComment,
        handleLikeToggle,
        toggleCommentForm,
        commentFormView,
        isLiked,
    } = useComment(comment);


    const MainBox = ({ comment }: { comment: Comment }) => (
        <FlexStyled className={classes.commentElement}>
            <Conditional isEnabled={!!repliedComment}>
                <FlexStyled className={classes.replyCard}>
                    <BoxStyled className="reply-card-indicator"></BoxStyled>
                    <Typography className="reply-card-text" lineClamp={1}>{repliedComment?.text}</Typography>
                </FlexStyled>
            </Conditional>
            <BoxStyled key={comment.id} className={classes.textBody}>
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
        </FlexStyled>
    );

    return (
        <BoxStyled className={classes.container}>
            <FlexStyled className={classes.mainElement}>
                <UserAvatar size="1.75rem" chars={toUpperFirstChar(comment.username)} />
                <MainBox comment={comment} />
            </FlexStyled>
            <Overlay onClose={toggleCommentForm} isOpen={false}>
                <CreateCommentForm postItem={comment} />
            </Overlay>
        </BoxStyled>
    );
};

export default CommentBox