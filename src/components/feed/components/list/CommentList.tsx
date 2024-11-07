import { ResId } from "@/api/schemas/native/common";
import React from "react";
import CommentBox from "../comment/base/Comment";
import { Comment } from "@/api/schemas/inferred/comment";

interface CommentListProps {
    comments: Array<Comment> | undefined
    postId: ResId
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
    if (!comments) return null;
    return comments.map((comment: Comment, index: number) => {
        if (!comment.parentId) return <CommentBox key={index} comment={comment} />;
        const repliedComment = comments.find(c => c.id === comment.parentId);
        return <CommentBox key={index} comment={comment} repliedComment={repliedComment} />;
    })
}

export default CommentList