import React, { useState } from "react";
import styles from "./styles/commentStyles";
import emoji from "react-easy-emoji";
import ReplyForm from "./ReplyForm";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteComment } from "../../hooks/useCommentData";
import { Avatar, Box, Flex } from "@mantine/core";
import { ContentType, LikeType } from "../../utils/enumClasses";
import { useToggleReaction } from "../../hooks/useReactionData";
import { toUpperFirstChar } from "../../utils/stringUtils";


const Comment = ({ comment }) => {

    const classes = styles();

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const deleteComment = useDeleteComment(comment.postId);
    const toggleLike = useToggleReaction(comment.id);

    const [replyFormView, setReplyFormView] = useState(false);


    const handleReaction = async (event, type) => {
        event.preventDefault();
        const reactionBody = {
            userId: user.id,
            contentId: comment.id,
            reactionType: type,
            contentType: ContentType.COMMENT.toString()
        }
        toggleLike.mutate(reactionBody);
    }

    const handleDeleteComment = () => {
        deleteComment.mutate(comment.id);
    }

    const handleLikeToggle = (event) => {
        handleReaction(event, LikeType.LIKE.toString())
    }

    const handleCommentReply = () => {
        setReplyFormView(!replyFormView);
    }

    const isLiked = comment.userReaction?.reactionType === LikeType.LIKE.name;

    const CommentElem = ({ comment }) => (
        <Flex className={classes.commentElement}>
            <Box key={comment.id} className={classes.textBody}>
                {
                    emoji(comment.text).map((element, index) => (
                        <p key={index} className="comment-text">{element}</p>
                    ))
                }
            </Box>
            <Box className={classes.commentOptions}>
                <p className="comment-like" onClick={handleLikeToggle}>{isLiked ? "unlike" : "like"}</p>
                <p className="comment-reply" onClick={handleCommentReply}>reply</p>
                <p className="comment-reply-count">{comment.replyCount}</p>
                {
                    comment.username === user.username &&
                    <p className="comment-delete" onClick={handleDeleteComment}>delete</p>
                }
            </Box>
            {
                replyFormView &&
                <ReplyForm postId={comment.postId} parentId={comment.id} toggleView={setReplyFormView} />
            }
        </Flex>
    );

    const CommentAvatar = ({ username }) => (
        <Avatar className={classes.avatar} size="1.75rem">{toUpperFirstChar(username)}</Avatar>
    )


    return (
        <Box className={classes.container}>
            <Flex className={classes.mainElement}>
                <CommentAvatar username={user.username} />
                <CommentElem comment={comment} />
            </Flex>
        </Box>
    )
}

export default Comment