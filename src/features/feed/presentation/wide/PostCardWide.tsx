import * as React from 'react';
import { useService } from '../../../../core/di';
import { FeedService } from '../../application/hooks/useFeedDI';
import {
  WideCard,
  WideContent,
  WideSidebar,
  WideHeader,
  WideAvatar,
  WideActions,
  WideStats
} from '../wide/styles/PostCardWide.styles';

// Mock post interface for demo
interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  likes: number;
  comments: number;
  shares: number;
  createdAt: Date;
}

// Wide Post Card Component
const PostCardWide: React.FC<{ post: Post }> = ({ post }) => {
  const feedService = useService(FeedService);
  
  const handleLike = () => {
    console.log(`Liked post: ${post.id}`);
    // In real app, this would call feedService.likePost(post.id)
  };
  
  const handleComment = () => {
    console.log(`Commented on post: ${post.id}`);
    // In real app, this would open comment overlay
  };
  
  const handleShare = () => {
    console.log(`Shared post: ${post.id}`);
    // In real app, this would open share dialog
  };
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  };
  
  return (
    <WideCard>
      <WideContent>
        <h3>{post.title}</h3>
        <p>{post.content}</p>
      </WideContent>
      
      <WideSidebar>
        <WideHeader>
          <WideAvatar>
            {post.author.name.charAt(0).toUpperCase()}
          </WideAvatar>
          <div>
            <div style={{ fontWeight: 600, fontSize: '16px' }}>
              {post.author.name}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {formatTime(post.createdAt)}
            </div>
          </div>
        </WideHeader>
        
        <WideActions>
          <button onClick={handleLike}>
            ❤️ Like
          </button>
          <button onClick={handleComment}>
            💬 Comment
          </button>
          <button onClick={handleShare}>
            🔄 Share
          </button>
        </WideActions>
        
        <WideStats>
          <div className="stat">
            <span className="stat-label">Likes:</span>
            <span>{post.likes}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Comments:</span>
            <span>{post.comments}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Shares:</span>
            <span>{post.shares}</span>
          </div>
        </WideStats>
      </WideSidebar>
    </WideCard>
  );
};

export { PostCardWide };
