# Feed Data Services Documentation

## Overview

The Feed feature provides comprehensive data services for managing posts, comments, and real-time updates through an enterprise-grade data layer architecture.

## Architecture

The Feed data services follow the revised 7-layer architecture pattern:

```
Component Layer → Hook Layer → DI Container → Service Layer → Data Layer → Cache/Repository/WebSocket Layers
```

## Core Data Services

### FeedDataService

**Location**: `src/features/feed/data/services/FeedDataService.ts`

**Purpose**: Primary data service for feed-related operations including post management, pagination, and real-time updates.

**Key Features**:
- Post CRUD operations with optimistic updates
- Infinite scroll pagination support
- Real-time WebSocket integration
- Advanced caching with TTL strategies
- Performance monitoring and metrics

**Main Methods**:
```typescript
class FeedDataService extends BaseDataService {
  // Post operations
  async getFeedPosts(options: FeedOptions): Promise<Post[]>
  async createPost(data: CreatePostData): Promise<Post>
  async updatePost(postId: string, data: UpdatePostData): Promise<Post>
  async deletePost(postId: string): Promise<void>
  
  // Pagination
  async getInfinitePosts(params: InfiniteQueryParams): Promise<InfiniteQueryResult<Post>>
  
  // Real-time updates
  private setupFeedWebSocketListeners(cacheKey: string): void
  private handleFeedWebSocketUpdate(cacheKey: string, message: WebSocketMessage): void
}
```

### PostDataService

**Location**: `src/features/feed/data/services/PostDataService.ts`

**Purpose**: Specialized service for individual post operations, including voting, saving, and poll management.

**Key Features**:
- Post interaction management (like, save, share)
- Poll voting and management
- Post analytics and metrics
- Media attachment handling

**Main Methods**:
```typescript
class PostDataService extends BaseDataService {
  // Post interactions
  async votePost(postId: string, voteType: VoteType): Promise<void>
  async savePost(postId: string, userId: string): Promise<void>
  async sharePost(postId: string, shareData: ShareData): Promise<ShareResult>
  
  // Poll operations
  async votePoll(pollId: string, optionId: string): Promise<void>
  async getPollResults(pollId: string): Promise<PollResults>
  
  // Media management
  async uploadMedia(file: File): Promise<MediaUploadResult>
  async deleteMedia(mediaId: string): Promise<void>
}
```

### CommentDataService

**Location**: `src/features/feed/data/services/CommentDataService.ts`

**Purpose**: Comprehensive comment management service with hierarchical threading support.

**Key Features**:
- Hierarchical comment threading
- Real-time comment updates
- Comment moderation tools
- Comment analytics and engagement metrics

**Main Methods**:
```typescript
class CommentDataService extends BaseDataService {
  // Comment CRUD
  async getComments(postId: string, options: CommentOptions): Promise<Comment[]>
  async createComment(data: CreateCommentData): Promise<Comment>
  async updateComment(commentId: string, data: UpdateCommentData): Promise<Comment>
  async deleteComment(commentId: string): Promise<void>
  
  // Threading support
  async getCommentReplies(commentId: string): Promise<Comment[]>
  async getCommentThread(commentId: string): Promise<CommentThread>
  
  // Moderation
  async moderateComment(commentId: string, action: ModerationAction): Promise<void>
  async reportComment(commentId: string, reason: string): Promise<void>
}
```

## Configuration

### Cache Configuration

Each service uses feature-specific cache configurations:

```typescript
const FEED_CACHE_CONFIG = {
  FEED_REALTIME: { staleTime: 15 * 1000, cacheTime: 2 * 60 * 1000 },
  FEED_STATIC: { staleTime: 30 * 60 * 1000, cacheTime: 2 * 60 * 60 * 1000 },
  POST_DETAIL: { staleTime: 5 * 60 * 1000, cacheTime: 15 * 60 * 1000 },
  COMMENTS: { staleTime: 10 * 1000, cacheTime: 5 * 60 * 1000 }
} as const;
```

### WebSocket Topics

Real-time updates use these WebSocket topics:

```typescript
const FEED_WEBSOCKET_TOPICS = {
  POST_CREATED: 'post.created',
  POST_UPDATED: 'post.updated',
  POST_DELETED: 'post.deleted',
  COMMENT_CREATED: 'comment.created',
  COMMENT_UPDATED: 'comment.updated',
  COMMENT_DELETED: 'comment.deleted',
  VOTE_UPDATED: 'vote.updated'
} as const;
```

## Usage Examples

### Basic Feed Operations

```typescript
import { useFeedServices } from '../hooks/useFeedServices';

function FeedComponent() {
  const { feedDataService } = useFeedServices();
  
  const loadFeed = async () => {
    const posts = await feedDataService.getFeedPosts({
      page: 1,
      limit: 20,
      filters: { type: 'all' }
    });
    
    return posts;
  };
  
  const createNewPost = async (postData: CreatePostData) => {
    return await feedDataService.createPost(postData);
  };
  
  return (
    // Component JSX
  );
}
```

### Real-time Updates

```typescript
function RealTimeFeed() {
  const { feedDataService } = useFeedServices();
  
  useEffect(() => {
    // Set up real-time listeners
    const cacheKey = feedDataService.generateCacheKey('feed', { page: 1 });
    feedDataService.setupFeedWebSocketListeners(cacheKey);
    
    return () => {
      feedDataService.cleanup(cacheKey, ['post.created', 'post.updated']);
    };
  }, [feedDataService]);
  
  // Component implementation
}
```

### Comment Threading

```typescript
function CommentSection({ postId }: { postId: string }) {
  const { commentDataService } = useFeedServices();
  
  const loadComments = async () => {
    const comments = await commentDataService.getComments(postId, {
      sortBy: 'created_at',
      order: 'desc',
      includeReplies: true
    });
    
    return comments;
  };
  
  const addComment = async (content: string, parentId?: string) => {
    return await commentDataService.createComment({
      postId,
      content,
      parentId,
      authorId: getCurrentUserId()
    });
  };
  
  return (
    // Comment component JSX
  );
}
```

## Performance Features

### Optimistic Updates

All data services support optimistic updates for better user experience:

```typescript
// Automatic optimistic updates
const newPost = await feedDataService.createPost(postData);
// UI updates immediately, server sync happens in background

// Rollback on error
try {
  const result = await feedDataService.updatePost(postId, updateData);
} catch (error) {
  // Automatic rollback of optimistic update
  feedDataService.updateCacheRemoveOptimistic(tempId);
}
```

### Intelligent Caching

- **Pattern-based Invalidation**: Cache entries invalidated based on data patterns
- **TTL Strategies**: Different TTL for different data types
- **Background Refresh**: Stale data refreshed in background
- **Memory Management**: Automatic cleanup of unused cache entries

### Performance Monitoring

Built-in performance tracking for all operations:

```typescript
const metrics = feedDataService.getCacheStats();
console.log('Cache hit rate:', metrics.hitRate);
console.log('Average response time:', metrics.averageResponseTime);
console.log('Memory usage:', metrics.memoryUsage);
```

## Integration with DI Container

The feed data services are properly integrated with the dependency injection system:

```typescript
// In DI container setup
container.bind<FeedDataService>(TYPES.FEED_DATA_SERVICE).to(FeedDataService);
container.bind<PostDataService>(TYPES.POST_DATA_SERVICE).to(PostDataService);
container.bind<CommentDataService>(TYPES.COMMENT_DATA_SERVICE).to(CommentDataService);

// Usage in components
const feedDataService = container.get<FeedDataService>(TYPES.FEED_DATA_SERVICE);
```

## Error Handling

Comprehensive error handling with proper error types and recovery strategies:

```typescript
try {
  const posts = await feedDataService.getFeedPosts(options);
} catch (error) {
  if (error instanceof NetworkError) {
    // Handle network issues
    feedDataService.handleNetworkError(error);
  } else if (error instanceof ValidationError) {
    // Handle validation errors
    feedDataService.handleValidationError(error);
  } else {
    // Handle unexpected errors
    feedDataService.handleUnexpectedError(error);
  }
}
```

## Testing

Mock implementations are available for testing:

```typescript
import { createMockFeedDataService } from '../__tests__/mocks/FeedDataService.mock';

describe('FeedComponent', () => {
  let mockFeedDataService: jest.Mocked<FeedDataService>;
  
  beforeEach(() => {
    mockFeedDataService = createMockFeedDataService();
  });
  
  it('should load feed posts', async () => {
    mockFeedDataService.getFeedPosts.mockResolvedValue(mockPosts);
    
    // Test component behavior
  });
});
```

## Migration from Legacy Services

### Before (Legacy Services)
```typescript
// Old approach - multiple separate services
import { PostService } from '../services/PostService';
import { CommentService } from '../services/CommentService';

const postService = new PostService();
const commentService = new CommentService();
```

### After (Data Services)
```typescript
// New approach - unified data services
import { useFeedServices } from '../hooks/useFeedServices';

const { postDataService, commentDataService } = useFeedServices();
```

## Best Practices

1. **Use Service Hooks**: Always use `useFeedServices()` hook to get service instances
2. **Cache Key Strategy**: Use the provided `generateCacheKey()` utility for consistent cache keys
3. **Error Boundaries**: Wrap service calls in proper error boundaries
4. **Performance Monitoring**: Monitor service performance metrics regularly
5. **WebSocket Cleanup**: Always clean up WebSocket listeners in component unmount

## Support

For questions or issues with the Feed data services:
- Check this documentation first
- Review existing service implementations
- Contact the Feed feature team
- Check performance metrics for optimization opportunities
