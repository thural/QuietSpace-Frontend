import React from "react";
import styles from "./styles/commentStyles";
import emoji from "react-easy-emoji";
import ReplyForm from "./ReplyForm";
import { Avatar, Box, Flex } from "@mantine/core";
import { toUpperFirstChar } from "../../utils/stringUtils";
import useComment from "./hooks/useComment";

const Comment = ({ comment }) => {
    const classes = styles();
    const {
        user,
        replyFormView,
        handleDeleteComment,
        handleLikeToggle,
        handleCommentReply,
        isLiked,
    } = useComment(comment);

    const CommentElem = ({ comment }) => (
        <Flex className={classes.commentElement}>
            <Box key={comment.id} className={classes.textBody}>
                {emoji(comment.text).map((element, index) => (
                    <p key={index} className="comment-text">{element}</p>
                ))}
            </Box>
            <Box className={classes.commentOptions}>
                <p className="comment-like" onClick={handleLikeToggle}>{isLiked ? "unlike" : "like"}</p>
                <p className="comment-reply" onClick={handleCommentReply}>reply</p>
                <p className="comment-reply-count">{comment.replyCount}</p>
                {comment.username === user.username && (
                    <p className="comment-delete" onClick={handleDeleteComment}>delete</p>
                )}
            </Box>
            {replyFormView && (
                <ReplyForm postId={comment.postId} parentId={comment.id} toggleView={setReplyFormView} />
            )}
        </Flex>
    );

    const CommentAvatar = ({ username }) => (
        <Avatar className={classes.avatar} size="1.75rem">{toUpperFirstChar(username)}</Avatar>
    );

    return (
        <Box className={classes.container}>
            <Flex className={classes.mainElement}>
                <CommentAvatar username={user.username} />
                <CommentElem comment={comment} />
            </Flex>
        </Box>
    );
};

export default Comment;