# Data Service Module - Feature Implementation Guide

## Overview

This guide explains how other features can implement their data services using the Data Service Module and leverage the data states in their React components.

## Feature Implementation Pattern

### Step 1: Create Feature-Specific Data Service

Every feature should extend `BaseDataService` to implement their data logic:

```typescript
// src/features/[feature]/data/[Feature]DataService.ts
import { BaseDataService } from '@/core/dataservice';
import type { IBaseDataService } from '@/core/dataservice';

export interface IPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPostRepository {
  getPosts(options: { page?: number; limit?: number }): Promise<IPost[]>;
  getPost(id: string): Promise<IPost>;
  createPost(post: Partial<IPost>): Promise<IPost>;
  updatePost(id: string, updates: Partial<IPost>): Promise<IPost>;
  deletePost(id: string): Promise<boolean>;
}

export class PostDataService extends BaseDataService {
  private repository: IPostRepository;

  constructor() {
    super();
    // Initialize repository from DI container
    this.repository = this.container.get<IPostRepository>('PostRepository');
  }

  /**
   * Get all posts with caching
   */
  async getPosts(options: { page?: number; limit?: number } = {}): Promise<IPost[]> {
    const cacheKey = this.generateCacheKey('posts', options);
    
    // Check cache first
    const cached = this.getCachedData<IPost[]>(cacheKey);
    if (cached && !this.isDataStale(cacheKey, this.CACHE_CONFIG.USER_CONTENT.staleTime)) {
      // Update state with cache hit metadata
      this.stateManager.setSuccess(cached, {
        source: 'cache',
        cacheHit: true,
        requestDuration: 0,
        retryCount: 0
      });
      return cached;
    }

    // Set loading state
    this.stateManager.setLoading(true);

    try {
      const posts = await this.repository.getPosts(options);
      
      // Cache the result
      this.cacheManager.set(cacheKey, posts, this.CACHE_CONFIG.USER_CONTENT.cacheTime);
      
      // Set success state with network metadata
      this.stateManager.setSuccess(posts, {
        source: 'network',
        cacheHit: false,
        requestDuration: 0, // Would measure actual duration
        retryCount: 0
      });

      return posts;
    } catch (error) {
      // Set error state
      this.stateManager.setError(error as Error);
      throw error;
    }
  }

  /**
   * Get a single post
   */
  async getPost(id: string): Promise<IPost> {
    const cacheKey = `post:${id}`;
    
    const cached = this.getCachedData<IPost>(cacheKey);
    if (cached && !this.isDataStale(cacheKey, this.CACHE_CONFIG.USER_CONTENT.staleTime)) {
      this.stateManager.setSuccess(cached, {
        source: 'cache',
        cacheHit: true,
        requestDuration: 0,
        retryCount: 0
      });
      return cached;
    }

    this.stateManager.setLoading(true);

    try {
      const post = await this.repository.getPost(id);
      
      this.cacheManager.set(cacheKey, post, this.CACHE_CONFIG.USER_CONTENT.cacheTime);
      
      this.stateManager.setSuccess(post, {
        source: 'network',
        cacheHit: false,
        requestDuration: 0,
        retryCount: 0
      });

      return post;
    } catch (error) {
      this.stateManager.setError(error as Error);
      throw error;
    }
  }

  /**
   * Create a new post
   */
  async createPost(postData: Partial<IPost>): Promise<IPost> {
    this.stateManager.setLoading(true);

    try {
      const newPost = await this.repository.createPost(postData);
      
      // Invalidate cache
      this.invalidateCache('posts');
      
      this.stateManager.setSuccess(newPost, {
        source: 'network',
        cacheHit: false,
        requestDuration: 0,
        retryCount: 0
      });

      return newPost;
    } catch (error) {
      this.stateManager.setError(error as Error);
      throw error;
    }
  }

  /**
   * Update a post
   */
  async updatePost(id: string, updates: Partial<IPost>): Promise<IPost> {
    this.stateManager.setLoading(true);

    try {
      const updatedPost = await this.repository.updatePost(id, updates);
      
      // Update cache
      const cacheKey = `post:${id}`;
      this.cacheManager.set(cacheKey, updatedPost, this.CACHE_CONFIG.USER_CONTENT.cacheTime);
      
      // Invalidate list cache
      this.invalidateCache('posts');
      
      this.stateManager.setSuccess(updatedPost, {
        source: 'network',
        cacheHit: false,
        requestDuration: 0,
        retryCount: 0
      });

      return updatedPost;
    } catch (error) {
      this.stateManager.setError(error as Error);
      throw error;
    }
  }

  /**
   * Delete a post
   */
  async deletePost(id: string): Promise<boolean> {
    this.stateManager.setLoading(true);

    try {
      const success = await this.repository.deletePost(id);
      
      // Remove from cache
      this.cacheManager.delete(`post:${id}`);
      this.invalidateCache('posts');
      
      this.stateManager.setSuccess(null, {
        source: 'network',
        cacheHit: false,
        requestDuration: 0,
        retryCount: 0
      });

      return success;
    } catch (error) {
      this.stateManager.setError(error as Error);
      throw error;
    }
  }
}
```

### Step 2: Create Feature-Specific Hooks

Create hooks that use the data service and React hooks:

```typescript
// src/features/[feature]/hooks/usePosts.ts
import { useCallback } from 'react';
import { useQuery, useMutation, useInfiniteQuery } from '@/core/dataservice';
import { PostDataService } from '../data/PostDataService';
import type { IPost } from '../data/PostDataService';

/**
 * Hook for fetching posts
 */
export function usePosts(options: { page?: number; limit?: number } = {}) {
  const dataService = new PostDataService();

  return useQuery(
    ['posts', options],
    () => dataService.getPosts(options),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      refetchOnWindowFocus: true,
      retry: 3
    }
  );
}

/**
 * Hook for fetching a single post
 */
export function usePost(id: string) {
  const dataService = new PostDataService();

  return useQuery(
    ['post', id],
    () => dataService.getPost(id),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: !!id, // Only fetch if id exists
      retry: 3
    }
  );
}

/**
 * Hook for creating posts
 */
export function useCreatePost() {
  const dataService = new PostDataService();

  return useMutation(
    (postData: Partial<IPost>) => dataService.createPost(postData),
    {
      onSuccess: (data) => {
        console.log('Post created successfully:', data);
        // You can also trigger notifications, update UI state, etc.
      },
      onError: (error) => {
        console.error('Failed to create post:', error);
        // Show error notification
      }
    }
  );
}

/**
 * Hook for updating posts
 */
export function useUpdatePost() {
  const dataService = new PostDataService();

  return useMutation(
    ({ id, updates }: { id: string; updates: Partial<IPost> }) => 
      dataService.updatePost(id, updates),
    {
      onSuccess: (data, variables) => {
        console.log('Post updated successfully:', data);
        // Update local state if needed
      },
      onError: (error) => {
        console.error('Failed to update post:', error);
      }
    }
  );
}

/**
 * Hook for deleting posts
 */
export function useDeletePost() {
  const dataService = new PostDataService();

  return useMutation(
    (id: string) => dataService.deletePost(id),
    {
      onSuccess: () => {
        console.log('Post deleted successfully');
        // Navigate away or show success message
      },
      onError: (error) => {
        console.error('Failed to delete post:', error);
      }
    }
  );
}

/**
 * Hook for infinite scrolling posts
 */
export function useInfinitePosts() {
  const dataService = new PostDataService();

  return useInfiniteQuery(
    'posts',
    ({ pageParam = 1 }) => 
      dataService.getPosts({ page: pageParam, limit: 10 })
        .then(posts => ({
          data: posts,
          nextPage: pageParam + 1,
          hasMore: posts.length === 10 // Assuming 10 means more pages available
        })),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      staleTime: 1 * 60 * 1000 // 1 minute
    }
  );
}
```

### Step 3: Create Feature-Specific Components

Use the hooks in your React components:

```typescript
// src/features/[feature]/components/PostList.tsx
import React from 'react';
import { usePosts, useDeletePost } from '../hooks/usePosts';
import type { IPost } from '../data/PostDataService';

export function PostList() {
  const { data: posts, isLoading, error, refetch } = usePosts();
  const deletePost = useDeletePost();

  const handleDelete = async (id: string) => {
    try {
      await deletePost.mutate(id);
      refetch(); // Refresh the list
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Posts</h2>
      <button onClick={() => refetch()}>Refresh</button>
      
      {posts?.map(post => (
        <div key={post.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <small>Created: {new Date(post.createdAt).toLocaleString()}</small>
          <button 
            onClick={() => handleDelete(post.id)}
            disabled={deletePost.isLoading}
            style={{ marginLeft: '10px', color: 'red' }}
          >
            {deletePost.isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      ))}
      
      {posts?.length === 0 && <div>No posts found</div>}
    </div>
  );
}
```

```typescript
// src/features/[feature]/components/CreatePostForm.tsx
import React, { useState } from 'react';
import { useCreatePost } from '../hooks/usePosts';
import type { IPost } from '../data/PostDataService';

export function CreatePostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const createPost = useCreatePost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createPost.mutate({
        title,
        content,
        authorId: 'current-user-id', // Would get from auth context
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      // Reset form on success
      setTitle('');
      setContent('');
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  return (
    <div>
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={createPost.isLoading}
            style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            disabled={createPost.isLoading}
            rows={4}
            style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        
        <button 
          type="submit"
          disabled={createPost.isLoading}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none' }}
        >
          {createPost.isLoading ? 'Creating...' : 'Create Post'}
        </button>
        
        {createPost.error && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            Error: {createPost.error.message}
          </div>
        )}
        
        {createPost.data && (
          <div style={{ color: 'green', marginTop: '10px' }}>
            Success! Post created with ID: {createPost.data.id}
          </div>
        )}
      </form>
    </div>
  );
}
```

```typescript
// src/features/[feature]/components/InfinitePostList.tsx
import React from 'react';
import { useInfinitePosts } from '../hooks/usePosts';

export function InfinitePostList() {
  const { 
    data: posts, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    isLoading,
    error 
  } = useInfinitePosts();

  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Infinite Post List</h2>
      
      {posts?.map(post => (
        <div key={post.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
      
      <button 
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none',
          marginTop: '20px'
        }}
      >
        {isFetchingNextPage ? 'Loading...' : hasNextPage ? 'Load More' : 'No More Posts'}
      </button>
    </div>
  );
}
```

### Step 4: Advanced Component with State Monitoring

For more advanced use cases, you can monitor the data service state directly:

```typescript
// src/features/[feature]/components/PostListWithState.tsx
import React, { useEffect, useState } from 'react';
import { PostDataService } from '../data/PostDataService';
import type { IPost } from '../data/PostDataService';

export function PostListWithState() {
  const [dataService] = useState(() => new PostDataService());
  const [posts, setPosts] = useState<IPost[]>([]);
  const [stateInfo, setStateInfo] = useState({
    isLoading: false,
    isError: false,
    isSuccess: false,
    error: null as Error | null,
    lastUpdated: null as number | null,
    refetchCount: 0
  });

  useEffect(() => {
    // Subscribe to data service state changes
    const unsubscribe = dataService.getStateManager().subscribe((state) => {
      setStateInfo({
        isLoading: state.isLoading,
        isError: state.isError,
        isSuccess: state.isSuccess,
        error: state.error,
        lastUpdated: state.lastUpdated,
        refetchCount: state.refetchCount
      });
    });

    // Initial fetch
    loadPosts();

    return unsubscribe;
  }, [dataService]);

  const loadPosts = async () => {
    try {
      const fetchedPosts = await dataService.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      // Error is already handled in the data service
    }
  };

  const getHelperInfo = () => {
    const helpers = dataService.getStateManager().helpers;
    return {
      isLoading: helpers.isLoading(),
      isError: helpers.isError(),
      isSuccess: helpers.isSuccess(),
      errorMessage: helpers.getError(),
      lastUpdated: helpers.getLastUpdated(),
      refetchCount: helpers.getRefetchCount(),
      isStale: helpers.isStale(5 * 60 * 1000) // Check if stale for 5 minutes
    };
  };

  return (
    <div>
      <h2>Post List with State Monitoring</h2>
      
      {/* State Information Panel */}
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '10px', 
        marginBottom: '20px',
        border: '1px solid #ddd'
      }}>
        <h4>Data Service State:</h4>
        <div>Loading: {stateInfo.isLoading ? 'Yes' : 'No'}</div>
        <div>Error: {stateInfo.isError ? 'Yes' : 'No'}</div>
        <div>Success: {stateInfo.isSuccess ? 'Yes' : 'No'}</div>
        <div>Refetch Count: {stateInfo.refetchCount}</div>
        <div>Last Updated: {stateInfo.lastUpdated ? new Date(stateInfo.lastUpdated).toLocaleString() : 'Never'}</div>
        {stateInfo.error && <div style={{ color: 'red' }}>Error: {stateInfo.error.message}</div>}
        
        <button onClick={loadPosts} style={{ marginTop: '10px' }}>
          Refresh Posts
        </button>
      </div>
      
      {/* Helper Information */}
      <div style={{ 
        backgroundColor: '#e8f4fd', 
        padding: '10px', 
        marginBottom: '20px',
        border: '1px solid #b3d9ff'
      }}>
        <h4>Helper Info:</h4>
        {Object.entries(getHelperInfo()).map(([key, value]) => (
          <div key={key}>{key}: {String(value)}</div>
        ))}
      </div>
      
      {/* Posts List */}
      <div>
        {posts.map(post => (
          <div key={post.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Step 5: Feature Module Index

Create an index file for your feature to export all the data service and hooks:

```typescript
// src/features/[feature]/index.ts
export { PostDataService } from './data/PostDataService';
export type { IPost, IPostRepository } from './data/PostDataService';

export {
  usePosts,
  usePost,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  useInfinitePosts
} from './hooks/usePosts';

export { PostList, CreatePostForm, InfinitePostList, PostListWithState } from './components';
```

## Usage in Other Features

Other features can now easily use your data service:

```typescript
// In another feature
import { PostDataService, usePosts } from '@/features/posts';

function SomeOtherComponent() {
  const { data: posts, isLoading } = usePosts();
  
  // Use posts from the posts feature
  return <div>Found {posts?.length || 0} posts</div>;
}
```

## Best Practices

### 1. **Separation of Concerns**
- **Data Service**: Handles data fetching, caching, and state management
- **Hooks**: Provide React integration and additional logic
- **Components**: Focus on UI rendering and user interactions

### 2. **Error Handling**
- Handle errors in data service (state management)
- Show user-friendly messages in hooks/components
- Use notifications for important actions

### 3. **Caching Strategy**
- Use appropriate cache times based on data type
- Invalidate cache when data changes
- Leverage cache hits for better performance

### 4. **Type Safety**
- Always use TypeScript interfaces for data models
- Export types for external consumption
- Use generic types for hooks

### 5. **Performance**
- Use React.memo for expensive components
- Implement proper loading states
- Use infinite scrolling for large datasets

This pattern provides a clean, scalable, and maintainable way to implement data services across all features in your application.
