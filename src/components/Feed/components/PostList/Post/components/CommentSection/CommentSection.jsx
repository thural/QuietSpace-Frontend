import BoxStyled from "@shared/BoxStyled";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import Comment from "./components/Comment/Comment";
import CommentForm from "./components/CommentForm/CommentForm";
import RepliedComment from "./components/CommentReply/CommentReply";
import styles from "./styles/commentSectionStyles";


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
        <BoxStyled className={classes.commentSection}>
            <CommentForm postId={postId} />
            <CommentList comments={comments} />
        </BoxStyled>
    )
}

export default CommentSection