import CommentReply from "../comment/replly/CommentReply";
import CommentBox from "../comment/base/Comment";
import { CommentList } from "@/api/schemas/inferred/comment";
import React from "react";
import { ResId } from "@/api/schemas/native/common";

interface CommentListProps {
    comments: CommentList | undefined
    postId: ResId
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
    if (!comments) return null;
    return comments.map((comment, index) => {
        if (!comment.parentId) return <CommentBox key={index} comment={comment} />;
        const repliedComment = comments.find(c => c.id === comment.parentId);
        return <CommentReply key={index} comment={comment} repliedComment={repliedComment} />;
    })
}

export default CommentList