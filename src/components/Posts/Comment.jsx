import React from "react";
import { toUpperFirstChar } from "../../utils/stringUtils";
import BoxStyled from "../Shared/BoxStyled";
import Conditional from "../Shared/Conditional";
import EmojiText from "../Shared/EmojiText";
import FlexStyled from "../Shared/FlexStyled";
import Typography from "../Shared/Typography";
import UserAvatar from "../Shared/UserAvatar";
import useComment from "./hooks/useComment";
import ReplyForm from "./ReplyForm";
import styles from "./styles/commentStyles";

const Comment = ({ comment }) => {
    const classes = styles();
    const {
        user,
        replyFormView,
        setReplyFormView,
        handleDeleteComment,
        handleLikeToggle,
        handleCommentReply,
        isLiked,
    } = useComment(comment);



    const CommentElem = ({ comment }) => (
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
                <ReplyForm postId={comment.postId} parentId={comment.id} toggleView={setReplyFormView} />
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

export default Comment;