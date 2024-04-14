import React, { useEffect } from "react";
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

    const repliedCommentSample = comments[1];
    repliedCommentSample.repliedCommentId = comments[0]["id"];
    repliedCommentSample.text = "a sample reply text to the first comment";
    repliedCommentSample.id = crypto.randomUUID();
    comments.push(repliedCommentSample);

    console.log("comments after mutation: ", comments)


    return (
        <div className={classes.commentSection}>
            <CommentForm />
            {
                !!comments &&
                comments.map((comment, index) => {
                    if (comment.repliedCommentId) {
                        const repliedComment = comments.find(c => c.id === comment.repliedCommentId)
                        return <RepliedComment key={index} comment={comment} repliedComment={repliedComment} />
                    }
                    else return <Comment key={index} comment={comment} />
                })
            }
        </div>
    )
}

export default CommentSection