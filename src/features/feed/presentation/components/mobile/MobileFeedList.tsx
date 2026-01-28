import * as React from 'react';
import { PostCardMobile } from './PostCardMobile';
import { useFeed } from '../../../application/hooks/useFeed';
import {
  MobileFeedContainer,
  MobileFeedHeader,
  MobileFeedActions,
  MobileFeedContent,
  MobileLoading,
  MobileEmpty
} from './styles';

// Mock posts data
const mockPosts = [
  {
    id: '1',
    title: 'Welcome to Mobile Feed',
    content: 'This is a mobile-optimized post card with touch-friendly interactions and responsive design.',
    author: { name: 'Mobile User' },
    likes: 42,
    comments: 8,
    createdAt: new Date(Date.now() - 300000)
  },
  {
    id: '2',
    title: 'DI Integration Success',
    content: 'The Feed feature has been successfully migrated to use dependency injection patterns with mobile-first design.',
    author: { name: 'DI System' },
    likes: 128,
    comments: 24,
    createdAt: new Date(Date.now() - 600000)
  }
];

// Mobile Feed List Component
const MobileFeedList: React.FC = () => {
  const { posts, loading, error, loadPosts, refreshFeed } = useFeed();

  React.useEffect(() => {
    loadPosts(0);
  }, [loadPosts]);

  const handleRefresh = async () => {
    await refreshFeed();
  };

  const handleCreatePost = () => {
    console.log('Opening mobile post creation...');
    // In real app, this would open mobile-optimized post form
  };

  return (
    <MobileFeedContainer>
      <MobileFeedHeader>
        <h1>Mobile Feed</h1>
        <MobileFeedActions>
          <button onClick={handleRefresh} disabled={loading}>
            {loading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
          <button onClick={handleCreatePost}>
            ✏️ Create Post
          </button>
        </MobileFeedActions>
      </MobileFeedHeader>

      <MobileFeedContent>
        {loading && posts.length === 0 ? (
          <MobileLoading>
            <div className="spinner"></div>
            <p>Loading feed...</p>
          </MobileLoading>
        ) : error ? (
          <MobileEmpty>
            <h2>❌ Error Loading Feed</h2>
            <p>{error}</p>
            <button onClick={handleRefresh}>Try Again</button>
          </MobileEmpty>
        ) : posts.length === 0 ? (
          <MobileEmpty>
            <h2>No Posts Yet</h2>
            <p>Be the first to share something with the community!</p>
            <button onClick={handleCreatePost}>Create Post</button>
          </MobileEmpty>
        ) : (
          posts.map(post => (
            <PostCardMobile key={post.id} post={post} />
          ))
        )}
      </MobileFeedContent>
    </MobileFeedContainer>
  );
};

export { MobileFeedList };
