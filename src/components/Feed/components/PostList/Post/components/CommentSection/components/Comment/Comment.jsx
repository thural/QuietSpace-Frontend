import BoxStyled from "@shared/BoxStyled";
import Conditional from "@shared/Conditional";
import EmojiText from "@shared/EmojiText";
import FlexStyled from "@shared/FlexStyled";
import Typography from "@shared/Typography";
import UserAvatar from "@shared/UserAvatar";
import { toUpperFirstChar } from "@utils/stringUtils";
import React from "react";
import CommentReplyForm from "../CommentForm/CommentForm";
import styles from "./commentStyles";
import useComment from "./useComment";

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
                <CommentReplyForm postId={comment.postId} parentId={comment.id} toggleView={setReplyFormView} />
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