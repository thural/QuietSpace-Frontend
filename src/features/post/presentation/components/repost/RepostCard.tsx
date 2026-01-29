import { PostResponse } from "../../../data/models/post";

export interface RepostCardProps {
    post: PostResponse;
    // TODO: Add other props when needed
}

const RepostCard: React.FC<RepostCardProps> = ({ post }) => {
    // TODO: Implement full RepostCard when all dependencies are available
    return (
        <div className="repost-card">
            <h4>Repost: {post.content || 'Post Content'}</h4>
            <p>Repost functionality coming soon...</p>
        </div>
    );
};

export default RepostCard;
