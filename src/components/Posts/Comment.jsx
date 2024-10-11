import React from "react";
import styles from "./styles/commentStyles";
import emoji from "react-easy-emoji";
import ReplyForm from "./ReplyForm";
import { Box, Flex } from "@mantine/core";
import { toUpperFirstChar } from "../../utils/stringUtils";
import useComment from "./hooks/useComment";
import Conditional from "../Shared/Conditional";
import UserAvatar from "../Shared/UserAvatar";

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

    const EmojiText = ({ text }) => {
        return emoji(text).map((element, index) => (
            <p key={index}>{element}</p>
        ))
    }

    const CommentElem = ({ comment }) => (
        <Flex className={classes.commentElement}>
            <Box key={comment.id} className={classes.textBody}>
                <EmojiText text={comment.text} />
            </Box>
            <Box className={classes.commentOptions}>
                <p className="comment-like" onClick={handleLikeToggle}>{isLiked ? "unlike" : "like"}</p>
                <p className="comment-reply" onClick={handleCommentReply}>reply</p>
                <p className="comment-reply-count">{comment.replyCount}</p>
                <Conditional isEnabled={comment.username === user.username}>
                    <p className="comment-delete" onClick={handleDeleteComment}>delete</p>
                </Conditional>
            </Box>
            <Conditional isEnabled={replyFormView} >
                <ReplyForm postId={comment.postId} parentId={comment.id} toggleView={setReplyFormView} />
            </Conditional>
        </Flex>
    );

    return (
        <Box className={classes.container}>
            <Flex className={classes.mainElement}>
                <UserAvatar size="1.75rem" chars={toUpperFirstChar(comment.username)} />
                <CommentElem comment={comment} />
            </Flex>
        </Box>
    );
};

export default Comment;