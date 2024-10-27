import BoxStyled from "@components/shared/BoxStyled";
import Conditional from "@components/shared/Conditional";
import EmojiText from "@components/shared/EmojiText";
import FlexStyled from "@components/shared/FlexStyled";
import Typography from "@components/shared/Typography";
import UserAvatar from "@components/shared/UserAvatar";
import { toUpperFirstChar } from "@/utils/stringUtils";
import CommentReplyForm from "../form/CommentForm";
import styles from "./styles/commentStyles";
import useComment from "./hooks/useComment";
import { Comment } from "@/api/schemas/inferred/comment";

const CommentBox = ({ comment }: { comment: Comment }) => {

    const classes = styles();

    const {
        user,
        replyFormView,
        handleDeleteComment,
        handleLikeToggle,
        handleCommentReply,
        isLiked,
    } = useComment(comment);


    const CommentElem = ({ comment }: { comment: Comment }) => (
        <FlexStyled className={classes.commentElement}>
            <BoxStyled key={comment.id} className={classes.textBody}>
                <EmojiText text={comment.text} />
            </BoxStyled>
            <BoxStyled className={classes.commentOptions}>
                <Typography className="comment-like" onClick={handleLikeToggle}>{isLiked ? "unlike" : "like"}</Typography>
                <Typography className="comment-reply" onClick={handleCommentReply}>reply</Typography>
                <Typography className="comment-reply-count">{comment.replyCount}</Typography>
                <Conditional isEnabled={comment.username === user.username}>
                    <Typography className="comment-delete" onClick={handleDeleteComment}>delete</Typography>
                </Conditional>
            </BoxStyled>
            <Conditional isEnabled={replyFormView} >
                <CommentReplyForm postId={comment.postId} />
            </Conditional>
        </FlexStyled>
    );

    return (
        <BoxStyled className={classes.container}>
            <FlexStyled className={classes.mainElement}>
                <UserAvatar size="1.75rem" chars={toUpperFirstChar(comment.username)} />
                <CommentElem comment={comment} />
            </FlexStyled>
        </BoxStyled>
    );
};

export default CommentBox