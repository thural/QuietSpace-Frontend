import React from "react";
import styles from "./styles/repliedCommentStyles";
import emoji from "react-easy-emoji";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteComment } from "../../hooks/useCommentData";
import { Avatar, Box, Flex, Text } from "@mantine/core";
import { generatePfp } from "../../utils/randomPfp";
import { useToggleReaction } from "../../hooks/useReactionData";


const RepliedComment = ({ comment, repliedComment }) => {

    const classes = styles();

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const deleteComment = useDeleteComment(comment.id);
    const toggleLike = useToggleReaction(comment.id);


    const handleDeleteComment = () => {
        deleteComment.mutate(comment.id);
    }

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

    const appliedStyle = {
        borderRadius: '1rem 0rem 1rem 1rem',
        marginLeft: 'auto'
    }


    const CommentBody = () => (
        <Box key={comment.id} className={classes.comment} style={appliedStyle}>
            <Flex className={classes.replyCard}>
                <div className="reply-card-indicator"></div>
                <Text className="reply-card-text" lineClamp={1}>
                    {repliedComment.text}
                </Text>
            </Flex>
            {
                emoji(comment.text).map((element, index) => (
                    <p key={index} className="comment-text">{element}</p>
                ))
            }
        </Box>
    );

    return (
        <Flex className={classes.container}>
            <CommentBody />
            <Avatar
                className={classes.avatar}
                size="1.75rem"
                src={generatePfp("beam")}>
                {user.username[0].toUpperCase()}
            </Avatar>
        </Flex>
    )
}

export default RepliedComment