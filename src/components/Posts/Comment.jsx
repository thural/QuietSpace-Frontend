import React from "react";
import styles from "./styles/commentStyles";
import emoji from "react-easy-emoji";
import { useQueryClient } from "@tanstack/react-query";
import { useToggleCommentLike, useDeleteComment } from "../../hooks/useCommentData";
import { Avatar, Box, Flex } from "@mantine/core";
import { generatePfp } from "../../utils/randomPfp";


const Comment = ({ comment }) => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const deleteComment = useDeleteComment(comment.postId);
    const toggleLike = useToggleCommentLike(comment.postId);

    console.log("comment data: ", comment);


    const handleDeleteComment = () => {
        deleteComment.mutate(comment.id);
    }

    const handleLikeToggle = () => {
        toggleLike.mutate(comment.id);
    }


    const likeCount = 0; // TODO: write backend code to return like counts
    const isLiked = true; // TODO: write backend code to return the value
    
    const classes = styles();


    return (
        <Flex className={classes.container}>
            <Avatar className={classes.avatar} size="1.75rem" src={generatePfp("beam")}>{user.username[0].toUpperCase()}</Avatar>
            <Box key={comment.id} className={classes.comment}>
                {
                    emoji(comment.text).map((element, index) => (
                        <p key={index} className="comment-text">{element}</p>
                    ))
                }

                {/* <div className="comment-options">
                    <p className="comment-like" onClick={handleLikeToggle}>{isLiked ? "unlike" : "like"}</p>
                    <p className="comment-reply">reply</p>
                    {
                        comment.username === user.username &&
                        <p className="comment-delete" onClick={handleDeleteComment}>delete</p>
                    }
                </div> */}
            </Box>
        </Flex>
    )
}

export default Comment