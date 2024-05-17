import React from "react";
import Comment from "./Comment";
import styles from "./styles/commentSectionStyles";
import { useQueryClient } from "@tanstack/react-query";
import CommentForm from "./CommentForm";
import RepliedComment from "./RepliedComment";


const CommentSection = ({ postId }) => {

    const queryClient = useQueryClient();
    const commentData = queryClient.getQueryData(["comments", { id: postId }]);
    const comments = commentData.content;


    const classes = styles();


    return (
        <div className={classes.commentSection}>
            <CommentForm postId={postId} />
            {
                !!comments &&
                comments.map((comment, index) => {
                    if (comment.parentId) {
                        const repliedComment = comments.find(c => c.id === comment.parentId)
                        return <RepliedComment key={index} comment={comment} repliedComment={repliedComment} />
                    }
                    else return <Comment key={index} postId={postId} comment={comment} />
                })
            }
        </div>
    )
}

export default CommentSection