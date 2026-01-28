# Data Service Module - React Hooks

## Overview

The Data Service Module now provides a complete set of React hooks for data fetching, with automatic state management, caching, error handling, and all the features developers expect from modern data fetching libraries.

## Available Hooks

### `useQuery<TData, TError = Error>`
Perfect for fetching data that needs to be cached and automatically refreshed.

```typescript
import { useQuery } from '@/core/dataservice';

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error, refetch } = useQuery(
    ['user', userId],
    () => fetch(`/api/users/${userId}`).then(res => res.json()),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
      retry: 3
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}
```

### `useMutation<TData, TVariables, TError = Error>`
Perfect for POST, PUT, DELETE operations that modify data.

```typescript
import { useMutation } from '@/core/dataservice';

function CreateUserForm() {
  const [name, setName] = useState('');
  
  const { mutate, isLoading, error, data } = useMutation(
    (userData: { name: string }) => 
      fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(userData)
      }).then(res => res.json()),
    {
      onSuccess: (data) => {
        console.log('User created:', data);
        setName(''); // Clear form
      },
      onError: (error) => {
        console.error('Failed to create user:', error);
      }
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ name });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="User name"
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create User'}
      </button>
      {error && <div>Error: {error.message}</div>}
      {data && <div>Success! User ID: {data.id}</div>}
    </form>
  );
}
```

### `useInfiniteQuery<TData, TError = Error>`
Perfect for pagination and infinite scrolling.

```typescript
import { useInfiniteQuery } from '@/core/dataservice';

function InfinitePostList() {
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    isLoading,
    error 
  } = useInfiniteQuery(
    'posts',
    ({ pageParam = 1 }) => 
      fetch(`/api/posts?page=${pageParam}&limit=10`)
        .then(res => res.json()),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage
    }
  );

  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
      
      <button 
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? 'Loading...' : 'Load More'}
      </button>
      
      {!hasNextPage && <div>No more posts</div>}
    </div>
  );
}
```

## Hook Options

### `useQuery` Options

```typescript
interface UseQueryOptions<TData, TError> {
  // Auto-refetching
  refetchOnWindowFocus?: boolean;     // Refetch when window gains focus
  refetchOnReconnect?: boolean;       // Refetch when network reconnects
  refetchInterval?: number | false;  // Auto-refetch at intervals
  
  // Retry behavior
  retry?: number | false;            // Number of retry attempts
  retryDelay?: number;              // Delay between retries (ms)
  
  // Request handling
  enableRequestCancellation?: boolean; // Enable abort controller
  
  // Initial state
  initialData?: TData;              // Initial data before fetch
  
  // Cache configuration
  staleTime?: number;               // Time until data is stale (ms)
  cacheTime?: number;               // Time to keep in cache (ms)
}
```

### `useMutation` Options

```typescript
interface UseMutationOptions<TData, TVariables, TError> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
  onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables) => void;
  retry?: number | false;
  retryDelay?: number;
}
```

## Hook Return Values

### `useQuery` Return Value

```typescript
interface UseQueryResult<TData, TError> {
  // State
  isLoading: boolean;      // Initial load
  isFetching: boolean;     // Refresh/fetch
  isError: boolean;        // Error state
  isSuccess: boolean;      // Success state
  error: TError | null;    // Error object
  data: TData | null;      // Fetched data
  
  // Metadata
  lastUpdated: number | null;  // Last successful fetch timestamp
  refetchCount: number;       // Number of refetches
  
  // Actions
  refetch: () => Promise<TData>;    // Manual refetch
  invalidate: () => void;           // Clear cache
}
```

### `useMutation` Return Value

```typescript
interface UseMutationResult<TData, TVariables, TError> {
  // State
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: TError | null;
  data: TData | null;
  
  // Actions
  mutate: (variables: TVariables) => Promise<TData>;
  reset: () => void;
}
```

### `useInfiniteQuery` Return Value

```typescript
interface UseInfiniteQueryResult<TData, TError> {
  // State (same as useQuery)
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: TError | null;
  data: TData[];
  
  // Pagination
  hasNextPage: boolean;        // More data available
  isFetchingNextPage: boolean;  // Currently fetching next page
  
  // Actions
  fetchNextPage: () => Promise<void>;  // Fetch next page
  refetch: () => Promise<void>;       // Refetch all pages
}
```

## Advanced Features

### Automatic Retry Logic

All hooks include intelligent retry logic with exponential backoff:

```typescript
const { data, error } = useQuery(
  'data',
  fetchData,
  {
    retry: 3,              // Retry up to 3 times
    retryDelay: 1000       // Start with 1s delay, then 2s, 4s
  }
);
```

### Request Cancellation

Prevent race conditions with automatic request cancellation:

```typescript
const { data } = useQuery(
  'data',
  fetchData,
  {
    enableRequestCancellation: true  // Cancel previous requests
  }
);
```

### Background Refetching

Keep data fresh with automatic background updates:

```typescript
const { data } = useQuery(
  'data',
  fetchData,
  {
    refetchOnWindowFocus: true,    // Refetch when user returns to tab
    refetchOnReconnect: true,     // Refetch when internet reconnects
    refetchInterval: 30000        // Refetch every 30 seconds
  }
);
```

### Optimistic Updates

Update UI immediately while waiting for server response:

```typescript
const { mutate } = useMutation(
  updatePost,
  {
    onMutate: async (newPost) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(['posts']);
      
      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(['posts']);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['posts'], (old: Post[]) => 
        old.map(post => 
          post.id === newPost.id ? newPost : post
        )
      );
      
      // Return a context object with the snapshotted value
      return { previousPosts };
    },
    onError: (err, newPost, context) => {
      // If the mutation fails, use the context returned from onMutate
      // to roll back
      queryClient.setQueryData(['posts'], context.previousPosts);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(['posts']);
    }
  }
);
```

## Integration with Data Service Module

The hooks work seamlessly with the Data Service Module's state management:

```typescript
import { createDataService } from '@/core/dataservice';
import { useQuery } from '@/core/dataservice';

function MyComponent() {
  // Create data service instance
  const dataService = createDataService(MyDataService);
  
  // Use with React hooks
  const { data, isLoading } = useQuery(
    'key',
    () => dataService.fetchData(),
    {
      onSuccess: (data) => {
        // Access data service state
        const state = dataService.getDataState();
        console.log('Data service state:', state);
      }
    }
  );
  
  return <div>{data?.name}</div>;
}
```

## Comparison with React Query

These hooks provide the same API and features as React Query:

| Feature | Data Service Hooks | React Query |
|---------|-------------------|-------------|
| ✅ Automatic caching | ✅ | ✅ |
| ✅ Background refetching | ✅ | ✅ |
| ✅ Retry logic | ✅ | ✅ |
| ✅ Request cancellation | ✅ | ✅ |
| ✅ Infinite queries | ✅ | ✅ |
| ✅ Optimistic updates | ✅ | ✅ |
| ✅ TypeScript support | ✅ | ✅ |
| ✅ DevTools integration | 🚧 | ✅ |
| ✅ Query invalidation | ✅ | ✅ |
| ✅ Pagination | ✅ | ✅ |

## Benefits

1. **Familiar API** - Same interface as React Query, zero learning curve
2. **TypeScript First** - Full type safety throughout
3. **Lightweight** - No external dependencies required
4. **Extensible** - Easy to customize and extend
5. **Performance** - Optimized for React 18+ with concurrent features
6. **Integration** - Works seamlessly with Data Service Module state management

## Migration from React Query

If you're already using React Query, migration is straightforward:

```typescript
// Before (React Query)
import { useQuery } from '@tanstack/react-query';

// After (Data Service Hooks)
import { useQuery } from '@/core/dataservice';

// API is identical - no code changes needed!
const { data, isLoading } = useQuery('key', fetcher, options);
```

The Data Service Module hooks provide a complete, production-ready data fetching solution that meets all the requirements of modern React applications.
