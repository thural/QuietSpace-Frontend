import { PostResponse } from "../../../data/models/post";

export interface PostReplyCardProps {
    post: PostResponse;
    // TODO: Add other props when needed
}

const PostReplyCard: React.FC<PostReplyCardProps> = ({ post }) => {
    // TODO: Implement full PostReplyCard when all dependencies are available
    return (
        <div className="post-reply-card">
            <h4>Reply to: {post.content || 'Post Content'}</h4>
            <p>Reply functionality coming soon...</p>
        </div>
    );
};

export default PostReplyCard;
