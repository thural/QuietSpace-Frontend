import React from "react";
import styles from "./styles/repliedCommentStyles";
import emoji from "react-easy-emoji";
import { Box, Flex, Text } from "@mantine/core";
import UserAvatar from "../Shared/UserAvatar";
import { toUpperFirstChar } from "../../utils/stringUtils";
import useRepliedComment from "./hooks/useRepliedComment";

const RepliedComment = ({ comment, repliedComment }) => {
    const classes = styles();
    const { user, handleDeleteComment, handleReaction } = useRepliedComment(comment);

    const appliedStyle = {
        borderRadius: '1rem 0rem 1rem 1rem',
        marginLeft: 'auto'
    };

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
            <UserAvatar chars={toUpperFirstChar(user.username)} />
        </Flex>
    );
};

export default RepliedComment;