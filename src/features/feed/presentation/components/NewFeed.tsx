import { PostCard } from "../../../post/presentation/components/post";
import { Comment } from "../../../comment/presentation/components";

// Define types locally to avoid import issues
interface PostResponse {
    id: string;
    content: string;
    authorId: string;
    authorName: string;
    createdAt: string;
}

interface CommentResponse {
    id: string;
    content: string;
    postId: string;
    authorId: string;
    authorName: string;
    createdAt: string;
}

interface FeedItem {
    type: 'post' | 'comment';
    data: PostResponse | CommentResponse;
}

/**
 * Props for the NewFeed component.
 */
interface NewFeedProps {
    items: FeedItem[];
    onLoadMore?: () => void;
}

/**
 * NewFeed component.
 * 
 * This component renders a feed using the new post and comment features.
 * It demonstrates the clean separation of concerns and how the features work together.
 * 
 * @param {NewFeedProps} props - The component props.
 * @returns {JSX.Element} - The rendered NewFeed component.
 */
const NewFeed: React.FC<NewFeedProps> = ({ items, onLoadMore }) => {
    // TODO: Implement actual feed logic when all dependencies are available
    return (
        <div className="new-feed">
            <h2>Feed (New Architecture)</h2>
            {items.map((item, index) => (
                <div key={item.data.id} className="feed-item">
                    {item.type === 'post' ? (
                        <PostCard post={item.data as PostResponse} />
                    ) : (
                        <Comment comment={item.data as CommentResponse} />
                    )}
                </div>
            ))}

            {onLoadMore && (
                <button onClick={onLoadMore} className="load-more-button">
                    Load More
                </button>
            )}
        </div>
    );
};

export default NewFeed;
