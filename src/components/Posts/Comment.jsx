import React, { useState } from "react";
import styles from "./styles/commentStyles";
import emoji from "react-easy-emoji";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteComment, useToggleReaction } from "../../hooks/useCommentData";
import { Avatar, Box, Flex } from "@mantine/core";
import { generatePfp } from "../../utils/randomPfp";
import ReplyForm from "./ReplyForm";
import { ContentType, LikeType } from "../../utils/enumClasses";


const Comment = ({ comment }) => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const deleteComment = useDeleteComment(comment.postId);
    const toggleLike = useToggleReaction(comment.id);

    const [replyFormView, setReplyFormView] = useState(false);

    const handleReaction = async (event, likeType) => {
        event.preventDefault();
        const reactionBody = {
            userId: user.id,
            contentId: comment.id,
            likeType: likeType,
            contentType: ContentType.COMMENT.toString(),
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


    const likeCount = 0; // TODO: write backend code to return like counts
    const isLiked = comment.userReaction?.likeType === LikeType.LIKE.toString();

    const classes = styles();


    return (
        <Box className={classes.container}>
            <Flex className={classes.mainElement}>
                <Avatar className={classes.avatar} size="1.75rem"
                    src={generatePfp("beam")}>{user.username[0].toUpperCase()}</Avatar>
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
            </Flex>
        </Box>
    )
}

export default Comment