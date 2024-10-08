import React from "react";
import Comment from "./Comment";
import styles from "./styles/commentSectionStyles";
import { useQueryClient } from "@tanstack/react-query";
import CommentForm from "./CommentForm";
import RepliedComment from "./RepliedComment";


const CommentSection = ({ postId }) => {

    const classes = styles();

    const queryClient = useQueryClient();
    const commentData = queryClient.getQueryData(["comments", { id: postId }]);
    const comments = commentData.content;


    const CommentList = ({ comments }) => {
        if (!comments) return null;
        return comments.map((comment, index) => {
            if (!comment.parentId) return <Comment key={index} postId={postId} comment={comment} />;
            const repliedComment = comments.find(c => c.id === comment.parentId);
            return <RepliedComment key={index} comment={comment} repliedComment={repliedComment} />;
        })
    }


    return (
        <div className={classes.commentSection}>
            <CommentForm postId={postId} />
            <CommentList comments={comments} />
        </div>
    )
}

export default CommentSection