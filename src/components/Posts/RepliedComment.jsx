import React from "react";
import styles from "./styles/commentStyles";
import emoji from "react-easy-emoji";
import { useQueryClient } from "@tanstack/react-query";
import { useToggleCommentLike, useDeleteComment } from "../../hooks/useCommentData";
import { Avatar, Box, Flex, Text } from "@mantine/core";
import { generatePfp } from "../../utils/randomPfp";


const RepliedComment = ({ comment, repliedComment }) => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const deleteComment = useDeleteComment(comment.postId);
    const toggleLike = useToggleCommentLike(comment.postId);


    const handleDeleteComment = () => {
        deleteComment.mutate(comment.id);
    }

    const handleLikeToggle = () => {
        toggleLike.mutate(comment.id);
    }


    const isLiked = comment.likes.some(likeObject => likeObject.userId === user.id);
    const classes = styles();

    const appliedStyle = {
        borderRadius: '1rem 1rem 0rem 1rem',
        marginLeft: 'auto'
    }

    return (
        <Flex className={classes.container}>


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