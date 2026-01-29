# Feed Feature Architecture

## 📋 **Overview**

The Feed feature handles all feed-related functionality including posts, comments, reactions, and user interactions. It follows the architectural principle of **separating business logic from authentication concerns**.

---

## 🏗️ **Architecture**

### **Clean Separation of Concerns**
```
Feed Feature (Business Logic Only)
├── Domain Layer
│   ├── Post entities and business rules
│   ├── Comment entities and relationships
│   └── Feed aggregation logic
├── Data Layer
│   ├── Repository implementations (no auth headers)
│   ├── Data services with caching
│   └── API integration
├── Application Layer
│   ├── Business services
│   ├── React hooks (data fetching only)
│   └── State management
└── Presentation Layer
    ├── UI components
    ├── Pages and layouts
    └── Styling

Auth Feature (Handles All Auth)
├── Authentication providers
├── Authorization and permissions
├── Token management
├── API interceptors (adds auth headers)
└── Route and component protection
```

---

## 📁 **Directory Structure**

```
src/features/feed/
├── domain/                          # Business domain
│   ├── entities/
│   │   ├── Post.ts                 # Post entity
│   │   ├── Comment.ts              # Comment entity
│   │   └── Feed.ts                 # Feed entity
│   ├── repositories/
│   │   ├── IPostRepository.ts     # Post repository interface
│   │   ├── ICommentRepository.ts  # Comment repository interface
│   │   └── IFeedRepository.ts     # Feed repository interface
│   └── services/
│       ├── PostService.ts          # Post business logic
│       ├── CommentService.ts       # Comment business logic
│       └── FeedService.ts          # Feed business logic
├── data/                            # Data access
│   ├── repositories/
│   │   ├── PostRepository.ts       # Post repository implementation
│   │   ├── CommentRepository.ts    # Comment repository implementation
│   │   └── MockPostRepository.ts   # Mock for testing
│   ├── services/
│   │   ├── FeedDataService.ts       # Feed data service
│   │   ├── PostDataService.ts       # Post data service
│   │   └── CommentDataService.ts    # Comment data service
│   ├── models/
│   │   ├── post.ts                 # Post data models
│   │   ├── comment.ts              # Comment data models
│   │   └── feed.ts                 # Feed data models
│   └── hooks/
│       ├── useFeedData.ts          # Feed data hooks
│       └── useFeedDataServices.ts  # Feed service hooks
├── application/                     # Application logic
│   ├── services/
│   │   ├── FeedFeatureService.ts    # Feed feature service
│   │   └── PostFeatureService.ts    # Post feature service
│   ├── hooks/
│   │   ├── useFeed.ts              # Feed hooks
│   │   ├── usePost.ts              # Post hooks
│   │   └── useComment.ts           # Comment hooks
│   └── stores/
│       └── feedUIStore.ts          # Feed UI state
├── presentation/                     # UI layer
│   ├── components/
│   │   ├── FeedList.tsx            # Feed list component
│   │   ├── PostCard.tsx            # Post card component
│   │   ├── CommentSection.tsx      # Comment section
│   │   └── CreatePostForm.tsx      # Post creation form
│   ├── pages/
│   │   ├── FeedPage.tsx            # Feed page
│   │   └── PostDetailPage.tsx      # Post detail page
│   └── styles/
│       ├── feedStyles.ts           # Feed styling
│       └── postStyles.ts           # Post styling
├── di/                              # Dependency injection
│   ├── FeedDIContainer.ts          # Feed DI container
│   ├── FeedDIConfig.ts             # DI configuration
│   └── useFeedDI.tsx               # Feed DI hook
└── index.ts                         # Feature exports
```

---

## 🔧 **Key Components**

### **Domain Layer**

#### **Post Entity**
```typescript
export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  likes: string[];
  comments: Comment[];
  likeCount: number;
  commentCount: number;
  tags: string[];
  isEdited: boolean;
}
```

#### **Repository Interfaces**
```typescript
export interface IPostRepository {
  getPosts(query: PostQuery): Promise<PostPage>;
  getPost(id: string): Promise<Post>;
  createPost(post: PostRequest): Promise<Post>;
  updatePost(id: string, post: PostRequest): Promise<Post>;
  deletePost(id: string): Promise<void>;
  // Note: No auth parameters - Auth feature handles this
}
```

### **Data Layer**

#### **Repository Implementation**
```typescript
@Injectable()
export class PostRepository implements IPostRepository {
  constructor(@Inject(TYPES.API_CLIENT) private apiClient: AxiosInstance) {}
  
  async getPosts(query: PostQuery): Promise<PostPage> {
    const pageParams = this.buildPageParams(query);
    const { data } = await this.apiClient.get(POST_URL + pageParams);
    // Note: No auth headers - Auth feature adds them automatically
    return data;
  }
}
```

#### **Data Services**
```typescript
@Injectable({
  lifetime: 'singleton',
  dependencies: [TYPES.IPOST_REPOSITORY, TYPES.CACHE_SERVICE]
})
export class PostDataService extends BaseDataService {
  constructor(
    @Inject(TYPES.IPOST_REPOSITORY) postRepository: IPostRepository,
    @Inject(TYPES.CACHE_SERVICE) cacheService: ICacheProvider
  ) {
    super();
    this.postRepository = postRepository;
    this.cache = cacheService;
  }
  
  async getPosts(query: PostQuery): Promise<Post[]> {
    // Business logic with caching
    return await this.executeQuery('posts', () => 
      this.postRepository.getPosts(query)
    );
  }
}
```

### **Application Layer**

#### **React Hooks**
```typescript
export const usePosts = (query: PostQuery = {}) => {
  const postService = usePostService();
  
  return useQuery({
    queryKey: ['posts', query],
    queryFn: () => postService.getPosts(query),
    // Note: No auth checks - Auth feature handles route protection
    enabled: true
  });
};
```

#### **Feature Services**
```typescript
@Injectable()
export class PostFeatureService {
  constructor(
    private postDataService: PostDataService,
    private commentDataService: CommentDataService
  ) {}
  
  async getPostWithComments(postId: string): Promise<PostWithComments> {
    const [post, comments] = await Promise.all([
      this.postDataService.getPost(postId),
      this.commentDataService.getCommentsByPostId(postId)
    ]);
    
    return { ...post, comments };
  }
}
```

### **Presentation Layer**

#### **Components**
```typescript
const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const { mutate: deletePost } = useDeletePost();
  
  const handleDelete = () => {
    deletePost(post.id);
  };
  
  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <div className="post-actions">
        <LikeButton postId={post.id} />
        <CommentButton postId={post.id} />
        <DeleteButton onDelete={handleDelete} />
      </div>
    </div>
  );
};
```

---

## 🔄 **Data Flow**

### **Query Flow**
```
Component → Hook → Service → Repository → API
    ↓         ↓       ↓          ↓        ↓
  UI     useQuery  Business   Data    HTTP
 Logic   State    Logic    Cache   Request
```

### **Mutation Flow**
```
Component → Hook → Service → Repository → API
    ↓         ↓       ↓          ↓        ↓
  User    useMutate  Business   Data    HTTP
 Action   Optimistic  Logic    Cache   Request
          Update
```

### **Auth Integration**
```
Request → Auth Interceptor → API
    ↓           ↓              ↓
Component  Add Auth      Server
 Call     Headers        Response
```

---

## 🛡️ **Security Model**

### **Feature Responsibility**
- Business logic validation
- Data integrity checks
- UI state management
- User experience

### **Auth Feature Responsibility**
- Authentication (login/logout)
- Authorization (permissions)
- Token management
- API security (headers, refresh)
- Route protection
- Component protection

### **Integration Points**
```typescript
// Feature uses Auth protection
<ProtectedRoute permission="feed:read">
  <FeedPage />
</ProtectedRoute>

// Feature uses Auth permissions in UI
import { usePermissions } from '@/features/auth';

const PostActions = () => {
  const { hasPermission } = usePermissions();
  
  return (
    <>
      <EditButton />
      {hasPermission('post:delete') && <DeleteButton />}
    </>
  );
};
```

---

## 🧪 **Testing Strategy**

### **Unit Tests**
- Test business logic in isolation
- Mock repositories and services
- No auth concerns in feature tests

### **Integration Tests**
- Test feature with mocked auth
- Verify API calls without auth headers
- Test business workflows

### **E2E Tests**
- Test complete user workflows
- Auth feature handles login/protection
- Feature focuses on business functionality

---

## 📊 **Performance Considerations**

### **Caching Strategy**
- **Data Layer**: Intelligent caching with TTL
- **Component Level**: React Query caching
- **Global State**: Zustand for UI state

### **Optimizations**
- **Lazy Loading**: Load posts on demand
- **Infinite Scroll**: Efficient pagination
- **Prefetching**: Related data preloading
- **Debouncing**: Search and filter inputs

---

## 🚀 **Usage Examples**

### **Basic Feed Usage**
```typescript
const FeedPage = () => {
  const { data: posts, isLoading, fetchNextPage } = usePosts();
  
  return (
    <div>
      <CreatePostForm />
      <InfiniteScroll
        data={posts}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        renderItem={(post) => <PostCard key={post.id} post={post} />}
      />
    </div>
  );
};
```

### **Protected Usage**
```typescript
// In routing setup
<Route 
  path="/feed" 
  element={
    <ProtectedRoute permission="feed:read">
      <FeedPage />
    </ProtectedRoute>
  } 
/>

// In component
const PostEditor = () => {
  const { hasPermission } = usePermissions();
  
  return (
    <div>
      <PostForm />
      {hasPermission('post:publish') && (
        <PublishButton />
      )}
    </div>
  );
};
```

---

## 📋 **Development Guidelines**

### **DOs**
- Focus on business logic only
- Use clean interfaces without auth parameters
- Leverage caching and optimization
- Write comprehensive tests
- Follow established patterns

### **DON'Ts**
- Add authentication logic
- Manage tokens or auth state
- Add authorization headers
- Implement permission checks
- Create auth guards

---

## 📚 **Related Documentation**

- [Auth Separation Architecture](../../architecture/AUTH_SEPARATION_ARCHITECTURE.md)
- [Feature Development Guidelines](../../development/FEATURE_DEVELOPMENT_GUIDELINES.md)
- [DI Container Guidelines](../../architecture/DI_GUIDELINES.md)
- [Testing Best Practices](../../testing/best-practices.md)

---

## ✅ **Summary**

The Feed feature demonstrates the clean separation architecture:

- **Business Logic Focused**: Pure feed functionality without auth concerns
- **Clean Interfaces**: No auth parameters in repositories
- **Secure Integration**: Auth feature handles all security
- **Testable**: Easy to test without auth complexity
- **Maintainable**: Clear boundaries and responsibilities

This architecture ensures that the Feed feature can focus on delivering excellent feed functionality while the Auth feature provides comprehensive security coverage.
