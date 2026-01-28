# Feed Data Layer Migration Guide

## 🎯 **Overview**

The Feed data layer has been simplified to use a single `FeedDataService` instead of multiple legacy services and hooks. This guide helps you migrate your components to use the new simplified hooks.

## 📊 **What Changed**

### **Removed Files**
- ❌ `usePostData.ts` (428 lines) → Replaced by `useFeedData.ts`
- ❌ `useCommentData.ts` (216 lines) → Replaced by `useFeedData.ts`
- ❌ `PostDataService.ts` (308 lines) → Replaced by `FeedDataService`
- ❌ `CommentDataService.ts` (255 lines) → Replaced by `FeedDataService`
- ❌ `FeedService.ts` (376 lines) → Business logic moved to hooks
- ❌ `PostService.ts` (~200 lines) → Business logic moved to hooks

### **New Files**
- ✅ `useFeedData.ts` - Simplified hooks using FeedDataService
- ✅ `hooks/index.ts` - Barrel export for all new hooks

## 🔄 **Migration Map**

### **Post Hooks**

| Old Hook | New Hook | Import Change |
|----------|----------|---------------|
| `useGetPagedPosts()` | `useFeedPosts()` | `from '@/features/feed/data/hooks'` |
| `useGetPostById()` | `usePost()` | `from '@/features/feed/data/hooks'` |
| `useGetPostsByUserId()` | `useUserPosts()` | `from '@/features/feed/data/hooks'` |
| `useGetSavedPostsByUserId()` | `useSavedPosts()` | `from '@/features/feed/data/hooks'` |
| `useQueryPosts()` | `useSearchPosts()` | `from '@/features/feed/data/hooks'` |
| `useCreatePost()` | `useCreatePost()` | `from '@/features/feed/data/hooks'` |
| `useEditPost()` | `useUpdatePost()` | `from '@/features/feed/data/hooks'` |
| `useDeletePost()` | `useDeletePost()` | `from '@/features/feed/data/hooks'` |
| `useSavePost()` | `useSavePost()` | `from '@/features/feed/data/hooks'` |
| `useVotePoll()` | `useVotePoll()` | `from '@/features/feed/data/hooks'` |

### **Comment Hooks**

| Old Hook | New Hook | Import Change |
|----------|----------|---------------|
| `useGetComments()` | `usePostComments()` | `from '@/features/feed/data/hooks'` |
| `useGetLatestComment()` | `usePostComments()` (with limit=1) | `from '@/features/feed/data/hooks'` |
| `usePostComment()` | `useAddComment()` | `from '@/features/feed/data/hooks'` |
| `useDeleteComment()` | `useDeleteComment()` | `from '@/features/feed/data/hooks'` |

### **New Hooks Available**

| Hook | Purpose |
|------|---------|
| `usePostWithComments()` | Get post with comments in parallel |
| `useReposts()` | Get reposts for a post |
| `usePollResults()` | Get poll results with live updates |
| `useCreateRepost()` | Create a repost |
| `useSharePost()` | Share a post |
| `useUnsavePost()` | Unsave a post |
| `useTogglePostLike()` | Toggle post like |
| `useUpdateComment()` | Update a comment |
| `usePinPost()` / `useUnpinPost()` | Pin/unpin posts |
| `useFeaturePost()` / `useUnfeaturePost()` | Feature/unfeature posts |
| `usePostAnalytics()` | Get post analytics |
| `useFeedAnalytics()` | Get feed analytics |

## 📝 **Migration Examples**

### **Before (Legacy)**
```typescript
import { useGetPagedPosts } from '@/features/feed/data/usePostData';

const MyComponent = () => {
  const { data, isLoading, error } = useGetPagedPosts();
  
  // ... component logic
};
```

### **After (New)**
```typescript
import { useFeedPosts } from '@/features/feed/data/hooks';

const MyComponent = () => {
  const { data, isLoading, error } = useFeedPosts();
  
  // ... component logic
};
```

### **Before (Legacy Comments)**
```typescript
import { useGetComments, usePostComment } from '@/features/feed/data/useCommentData';

const CommentSection = ({ postId }) => {
  const { data: comments } = useGetComments(postId);
  const createComment = usePostComment();
  
  // ... component logic
};
```

### **After (New Comments)**
```typescript
import { usePostComments, useAddComment } from '@/features/feed/data/hooks';

const CommentSection = ({ postId }) => {
  const { data: comments } = usePostComments(postId);
  const createComment = useAddComment();
  
  // ... component logic
};
```

## 🎯 **Key Benefits**

### **✅ Simplified Architecture**
- **Single Data Source**: All operations go through `FeedDataService`
- **Consistent Caching**: Unified cache strategy across all operations
- **WebSocket Integration**: Real-time updates for all operations
- **Optimistic Updates**: Consistent optimistic updates with rollback

### **✅ Better Performance**
- **Reduced Bundle Size**: Removed ~1,783 lines of duplicate code
- **Fewer Network Calls**: Intelligent caching and invalidation
- **Parallel Operations**: `usePostWithComments()` fetches data in parallel

### **✅ Improved Developer Experience**
- **Type Safety**: Full TypeScript support with proper interfaces
- **Consistent API**: All hooks follow the same patterns
- **Better Error Handling**: Unified error handling across all operations

## 🔧 **Advanced Usage**

### **Custom Query Options**
```typescript
import { useFeedPosts } from '@/features/feed/data/hooks';

const MyComponent = () => {
  const { data, isLoading } = useFeedPosts({ 
    userId: 'user123',
    sortBy: 'createdAt',
    sortDirection: 'desc'
  });
  
  // ... component logic
};
```

### **Mutation with Callbacks**
```typescript
import { useCreatePost } from '@/features/feed/data/hooks';

const CreatePostForm = () => {
  const createPost = useCreatePost(() => {
    // Success callback
    console.log('Post created successfully');
    // Navigate or close form
  });
  
  const handleSubmit = (postData) => {
    createPost.mutate(postData);
  };
  
  // ... component logic
};
```

### **Analytics and Advanced Features**
```typescript
import { 
  usePostAnalytics, 
  useFeedAnalytics,
  usePollResults 
} from '@/features/feed/data/hooks';

const PostAnalytics = ({ postId }) => {
  const { data: analytics } = usePostAnalytics(postId);
  const { data: feedAnalytics } = useFeedAnalytics();
  
  // ... component logic
};
```

## 🚨 **Breaking Changes**

### **Import Paths**
```typescript
// ❌ OLD
import { useGetPagedPosts } from '@/features/feed/data/usePostData';
import { useGetComments } from '@/features/feed/data/useCommentData';

// ✅ NEW
import { useFeedPosts, usePostComments } from '@/features/feed/data/hooks';
```

### **Hook Names**
```typescript
// ❌ OLD
useGetPagedPosts()
useGetPostById()
useGetComments()
usePostComment()

// ✅ NEW
useFeedPosts()
usePost()
usePostComments()
useAddComment()
```

### **Service Access**
```typescript
// ❌ OLD
const { feedFeatureService, postDataService } = useFeedServices();

// ✅ NEW
const feedDataService = useFeedDataService();
```

## 🎯 **Next Steps**

1. **Update Imports**: Replace all old hook imports with new ones
2. **Update Hook Names**: Use the new hook names
3. **Test Components**: Ensure all components work with new hooks
4. **Remove Unused Dependencies**: Clean up any unused service imports
5. **Update Tests**: Update test files to use new hooks

## 📞 **Support**

If you encounter any issues during migration:

1. Check the [FeedDataService](./FeedDataService.ts) for available methods
2. Look at the [new hooks](./hooks/useFeedData.ts) for usage examples
3. Refer to the [cache configuration](./cache/CacheKeys.ts) for cache strategies
4. Check the [domain types](../domain/) for proper type usage

---

**Migration Status**: ✅ **COMPLETE**  
**Files Removed**: 6 obsolete files (~1,783 lines)  
**Files Added**: 2 new files (simplified hooks)  
**Breaking Changes**: Import paths and hook names  
**Benefits**: Single source of truth, better performance, cleaner architecture
