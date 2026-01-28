import * as React from 'react';
import { PostCardWide } from './PostCardWide';
import { useFeed } from '../../../application/hooks/useFeed';
import {
  WideFeedContainer,
  WideFeedHeader,
  WideFeedContent,
  WideFeedActions,
  WideLoading,
  WideEmpty
} from './styles/WideFeedList.styles';

// Mock posts data
const mockPosts = [
  {
    id: '1',
    title: 'Welcome to Wide Feed',
    content: 'This is a wide-optimized post card with desktop-friendly layout and enhanced interactions. Perfect for larger screens with more space for content and actions.',
    author: { name: 'Wide User' },
    likes: 156,
    comments: 42,
    shares: 23,
    createdAt: new Date(Date.now() - 300000)
  },
  {
    id: '2',
    title: 'DI Wide Integration Success',
    content: 'The Feed feature has been successfully migrated to use dependency injection patterns with wide-first design. The layout uses CSS Grid for optimal space utilization and includes enhanced interaction states.',
    author: { name: 'DI System' },
    likes: 342,
    comments: 89,
    shares: 67,
    createdAt: new Date(Date.now() - 600000)
  }
];

// Wide Feed List Component
const WideFeedList: React.FC = () => {
  const { posts, loading, error, loadPosts, refreshFeed } = useFeed();

  React.useEffect(() => {
    loadPosts(0);
  }, [loadPosts]);

  const handleRefresh = async () => {
    await refreshFeed();
  };

  const handleCreatePost = () => {
    console.log('Opening wide post creation...');
    // In real app, this would open wide-optimized post form
  };

  const handleFilter = (filter: string) => {
    console.log(`Filtering posts by: ${filter}`);
    // In real app, this would apply feed filters
  };

  return (
    <WideFeedContainer>
      <WideFeedHeader>
        <h1>Wide Feed</h1>
        <WideFeedActions>
          <button onClick={handleRefresh} disabled={loading}>
            {loading ? 'Refreshing...' : '🔄 Refresh Feed'}
          </button>
          <button onClick={handleCreatePost}>
            ✏️ Create Post
          </button>
          <select onChange={(e) => handleFilter(e.target.value)}>
            <option value="">All Posts</option>
            <option value="recent">Recent</option>
            <option value="popular">Popular</option>
            <option value="following">Following</option>
          </select>
        </WideFeedActions>
      </WideFeedHeader>

      <WideFeedContent>
        {loading && posts.length === 0 ? (
          <WideLoading>
            <div className="spinner"></div>
            <p>Loading wide feed...</p>
          </WideLoading>
        ) : error ? (
          <WideEmpty>
            <h2>❌ Error Loading Feed</h2>
            <p>{error}</p>
            <button onClick={handleRefresh}>Try Again</button>
          </WideEmpty>
        ) : posts.length === 0 ? (
          <WideEmpty>
            <h2>No Posts Yet</h2>
            <p>Be the first to share something with the community!</p>
            <p>The wide layout provides optimal space for content creation and interaction.</p>
            <button onClick={handleCreatePost}>Create Post</button>
          </WideEmpty>
        ) : (
          posts.map(post => (
            <PostCardWide key={post.id} post={post} />
          ))
        )}
      </WideFeedContent>
    </WideFeedContainer>
  );
};

export { WideFeedList };
