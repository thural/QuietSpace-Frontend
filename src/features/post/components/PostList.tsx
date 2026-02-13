/**
 * Post List Component
 * 
 * Example React component demonstrating centralized logging integration
 */

import React, { useEffect, useState } from 'react';
import { useLogger } from '@/features/logging/hooks';
import type { Post } from '../data/services/PostDataService';

interface PostListProps {
  posts: Post[];
  onPostClick: (postId: string) => void;
  userId?: string;
}

export const PostList: React.FC<PostListProps> = ({ posts, onPostClick, userId }) => {
  const logger = useLogger({
    category: 'app.components.PostList',
    enablePerformanceMonitoring: true
  });

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  useEffect(() => {
    logger.logWithContext(
      'info',
      {
        component: 'PostList',
        action: 'component_mounted',
        ...(userId && { userId }),
        additionalData: {
          postCount: posts.length
        }
      },
      'PostList component mounted with {} posts for user {}',
      posts.length,
      userId || 'anonymous'
    );
  }, [posts.length, userId, logger]);

  const handlePostClick = (postId: string) => {
    logger.logWithContext(
      'info',
      {
        component: 'PostList',
        action: 'post_clicked',
        ...(userId && { userId }),
        additionalData: {
          postId
        }
      },
      'Post clicked: {} by user {}',
      postId,
      userId || 'anonymous'
    );

    setSelectedPostId(postId);
    onPostClick(postId);
  };

  const handlePostLike = (postId: string) => {
    logger.logWithContext(
      'metrics',
      {
        component: 'PostList',
        action: 'post_liked',
        ...(userId && { userId }),
        additionalData: {
          postId
        }
      },
      'Post liked: {} by user {}',
      postId,
      userId || 'anonymous'
    );
  };

  return (
    <div className="post-list">
      <h2>Posts ({posts.length})</h2>
      {posts.map(post => (
        <div
          key={post.id}
          className={`post-item ${selectedPostId === post.id ? 'selected' : ''}`}
          onClick={() => handlePostClick(post.id)}
        >
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <div className="post-meta">
            <span>By: {post.authorName}</span>
            <span>Likes: {post.likeCount}</span>
            <span>Comments: {post.commentCount}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePostLike(post.id);
            }}
          >
            Like
          </button>
        </div>
      ))}
    </div>
  );
};
