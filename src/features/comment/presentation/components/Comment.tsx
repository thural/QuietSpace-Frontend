// Define CommentResponse locally to avoid import issues
interface CommentResponse {
    id: string;
    content: string;
    postId: string;
    authorId: string;
    authorName: string;
    createdAt: string;
    updatedAt?: string;
}

import CommentControls from "./CommentControls";

/**
 * Props for the Comment component.
 */
interface CommentProps {
    comment: CommentResponse;
}

/**
 * Comment component.
 * 
 * This component renders a comment with its content, author information,
 * and controls for editing, deleting, and replying.
 * 
 * @param {CommentProps} props - The component props.
 * @returns {JSX.Element} - The rendered Comment component.
 */
const Comment: React.FC<CommentProps> = ({ comment }) => {
    // TODO: Implement full Comment component when all dependencies are available
    return (
        <div className="comment">
            <h4>{comment.authorName}</h4>
            <p>{comment.content}</p>
            <small>{new Date(comment.createdAt).toLocaleString()}</small>
            
            {/* Add CommentControls when available */}
            <CommentControls 
                comment={comment}
                isOwner={false} // TODO: Determine ownership
                onLike={() => console.log('Like clicked')}
                onReply={() => console.log('Reply clicked')}
            />
        </div>
    );
};

export default Comment;
