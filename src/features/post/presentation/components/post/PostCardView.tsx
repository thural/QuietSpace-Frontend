import { PostResponse } from "../../../data/models/post";

export interface PostCardViewProps {
    post: PostResponse;
    isBaseCard?: boolean;
    isMenuHidden?: boolean;
    postData?: any; // Temporary type until usePost hook is available
    children?: React.ReactNode;
}

const PostCardView: React.FC<PostCardViewProps> = ({
    post,
    isBaseCard = false,
    isMenuHidden = false,
    children,
    postData
}) => {
    // TODO: Implement full PostCardView when all dependencies are available
    return (
        <div className="post-card">
            <h3>{post.content || 'Post Content'}</h3>
            <p>Author: {post.authorName || 'Unknown'}</p>
            {children}
        </div>
    );
};

export default PostCardView;
