import React, { useEffect, useRef, useState } from "react";
import Comment from "./Comment";
import styles from "./styles/commentSectionStyles";
import { useQueryClient } from "@tanstack/react-query";
import CommentForm from "./CommentForm";


const CommentSection = ({ postId }) => {

    const queryClient = useQueryClient();
    const commentData = queryClient.getQueryData(["comments", { id: postId }]);
    const comments = commentData.content;


    const classes = styles();


    return (
        <div className={classes.commentSection}>
            <CommentForm />
            {
                !!comments &&
                comments.map(comment => <Comment key={comment.id} comment={comment} />)
            }
        </div>
    )
}

export default CommentSection