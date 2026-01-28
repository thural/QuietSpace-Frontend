import * as React from 'react';
import { useFeed } from '../../../application/hooks/useFeed';
import {
  MobileCard,
  MobileHeader,
  MobileAvatar,
  MobileContent,
  MobileActions
} from './styles';

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
  createdAt: Date;
}

// Mobile Post Card Component
const PostCardMobile: React.FC<{ post: Post }> = ({ post }) => {
  const { likePost, commentPost } = useFeed();

  const handleLike = () => {
    likePost(post.id);
  };

  const handleComment = () => {
    commentPost(post.id, 'Mock comment');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  };

  return (
    <MobileCard>
      <MobileHeader>
        <MobileAvatar>
          {post.author.name.charAt(0).toUpperCase()}
        </MobileAvatar>
        <div>
          <div style={{ fontWeight: 600, fontSize: '14px' }}>
            {post.author.name}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {formatTime(post.createdAt)}
          </div>
        </div>
      </MobileHeader>

      <MobileContent>
        <h3>{post.title}</h3>
        <p>{post.content}</p>
      </MobileContent>

      <MobileActions>
        <button onClick={handleLike}>
          ❤️ {post.likes}
        </button>
        <button onClick={handleComment}>
          💬 {post.comments}
        </button>
      </MobileActions>
    </MobileCard>
  );
};

export { PostCardMobile };
