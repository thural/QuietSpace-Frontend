import * as React from 'react';
import { useFeed } from '../../../application/hooks/useFeed';
import { PostCard } from '../../../../../shared/ui/components/social';
import type { IPostCardProps } from '../../../../../shared/ui/components/social';

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

  // Convert post data to PostCard props
  const postCardProps: IPostCardProps = {
    title: post.title,
    content: post.content,
    author: post.author,
    timestamp: formatTime(post.createdAt),
    metadata: {
      likes: post.likes,
      comments: post.comments,
      shares: 0, // Not available in this interface
    },
    variant: 'compact', // Mobile-friendly variant
    onClick: () => {
      console.log(`Post clicked: ${post.id}`);
    },
    actions: (
      <>
        <button onClick={handleLike}>
          ❤️ {post.likes}
        </button>
        <button onClick={handleComment}>
          💬 {post.comments}
        </button>
      </>
    ),
  };

  return <PostCard {...postCardProps} />;
};

export { PostCardMobile };
