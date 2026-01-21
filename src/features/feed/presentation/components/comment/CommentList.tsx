import { ResId } from "@/shared/api/models/commonNative";
import React from "react";
import CommentBox from "./Comment";
import { CommentResponse } from "@/features/feed/data/models/comment";

/**
 * Props for the CommentList component.
 *
 * @interface CommentListProps
 * @property {Array<CommentResponse> | undefined} comments - The array of comments to display, or undefined if not available.
 * @property {ResId} postId - The ID of the post associated with the comments.
 */
interface CommentListProps {
    comments: Array<CommentResponse> | undefined;
    postId: ResId;
}

/**
 * CommentList component that renders a list of comments for a given post.
 *
 * The component checks if the comments array is defined. If not, it returns null.
 * It then maps over the comments array, rendering each comment using the CommentBox component.
 * If a comment has a parentId, it means that it is a reply to another comment.
 * The component searches for the parent comment in the comments array and passes it to the CommentBox.
 *
 * @param {CommentListProps} props - The props for the CommentList component.
 * @returns {JSX.Element | null} - The rendered list of comment boxes or null if no comments are provided.
 */
const CommentList: React.FC<CommentListProps> = ({ comments }) => {
    if (!comments) return null;

    return comments.map((comment: CommentResponse, index: number) => {
        // If the comment does not have a parentId, render it as a top-level comment
        if (!comment.parentId) return <CommentBox key={index} comment={comment} />;
        // If the comment has a parentId, find the parent comment in the array
        const repliedComment = comments.find(c => c.id === comment.parentId);
        // Render the comment along with its replied parent comment
        return <CommentBox key={index} comment={comment} repliedComment={repliedComment} />;
    });
}

export default CommentList;