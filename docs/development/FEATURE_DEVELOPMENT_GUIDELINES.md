# Feature Development Guidelines

## 📋 **Overview**

This document provides guidelines for developing features in QuietSpace Frontend with the new architectural decision that **authentication and authorization logic is handled exclusively by the Auth feature**.

---

## 🎯 **Core Principle**

**Features should focus solely on their business logic. The Auth feature handles all authentication, authorization, and security concerns.**

---

## 🏗️ **Feature Structure**

### **Standard Feature Directory Structure**
```
src/features/{feature-name}/
├── domain/                 # Business entities and rules
│   ├── entities/          # Domain entities
│   ├── repositories/      # Repository interfaces
│   └── services/          # Domain services
├── data/                   # Data access layer
│   ├── repositories/      # Repository implementations
│   ├── services/          # Data services
│   └── models/            # Data models
├── application/           # Application logic
│   ├── services/          # Application services
│   ├── hooks/             # React hooks
│   └── stores/            # State management
├── presentation/          # UI layer
│   ├── components/        # React components
│   ├── pages/             # Page components
│   └── styles/            # Styling
├── di/                     # Dependency injection
│   ├── container.ts       # DI container
│   └── config.ts          # DI configuration
└── index.ts               # Feature exports
```

---

## ✅ **DOs - Feature Development**

### **1. Focus on Business Logic**
```typescript
// ✅ GOOD - Pure business logic
export class PostService {
  async createPost(postData: PostRequest): Promise<Post> {
    // Business validation
    if (!postData.title?.trim()) {
      throw new ValidationError('Title is required');
    }
    
    // Business logic only
    return await this.postRepository.create(postData);
  }
}
```

### **2. Clean Repository Interfaces**
```typescript
// ✅ GOOD - No auth parameters
export interface IPostRepository {
  getPosts(query: PostQuery): Promise<PostPage>;
  getPost(id: string): Promise<Post>;
  createPost(post: PostRequest): Promise<Post>;
  updatePost(id: string, post: PostRequest): Promise<Post>;
  deletePost(id: string): Promise<void>;
}
```

### **3. Simple React Hooks**
```typescript
// ✅ GOOD - Data fetching only
export const usePosts = (query: PostQuery = {}) => {
  const postService = usePostService();
  
  return useQuery({
    queryKey: ['posts', query],
    queryFn: () => postService.getPosts(query),
    enabled: true // No auth checks needed
  });
};
```

### **4. Pure UI Components**
```typescript
// ✅ GOOD - UI logic only
const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  
  const handleLike = () => {
    // UI state only - auth handled by Auth feature
    setIsLiked(!isLiked);
  };
  
  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <button onClick={handleLike}>
        {isLiked ? 'Unlike' : 'Like'}
      </button>
    </div>
  );
};
```

### **5. Clean DI Container**
```typescript
// ✅ GOOD - Business dependencies only
export class FeedDIContainer {
  constructor(
    private postRepository: IPostRepository,
    private commentRepository: ICommentRepository,
    private cacheService: ICacheService
  ) {}
  
  getPostService(): PostService {
    return new PostService(this.postRepository);
  }
}
```

---

## ❌ **DON'Ts - What to Avoid**

### **1. No Authentication Logic**
```typescript
// ❌ BAD - Don't handle auth in features
export const usePosts = () => {
  const { isAuthenticated, user } = useAuthStore(); // DON'T
  
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => {
      if (!isAuthenticated) return null; // DON'T
      return postService.getPosts();
    },
    enabled: isAuthenticated // DON'T
  });
};
```

### **2. No Token Management**
```typescript
// ❌ BAD - Don't manage tokens
export class PostRepository {
  async getPosts(query: PostQuery, token: string): Promise<PostPage> { // DON'T
    return await api.get('/posts', {
      headers: { Authorization: `Bearer ${token}` } // DON'T
    });
  }
}
```

### **3. No Permission Checking**
```typescript
// ❌ BAD - Don't check permissions in features
const PostEditor: React.FC = () => {
  const { user } = useAuthStore(); // DON'T
  
  if (!user.permissions.includes('post:edit')) { // DON'T
    return <AccessDenied />;
  }
  
  return <Editor />;
};
```

### **4. No Auth Guards**
```typescript
// ❌ BAD - Don't implement auth guards
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuthStore(); // DON'T
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />; // DON'T
  }
  
  return <Outlet />;
};
```

---

## 🔄 **Auth Feature Integration**

### **How to Use Auth Features**

#### **Route Protection**
```typescript
// ✅ Use Auth feature guards
import { ProtectedRoute } from '@/features/auth';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route 
      path="/feed" 
      element={
        <ProtectedRoute permission="feed:read">
          <FeedPage />
        </ProtectedRoute>
      } 
    />
  </Routes>
);
```

#### **Component Protection**
```typescript
// ✅ Use Auth feature HOCs
import { withAuth } from '@/features/auth';

const ProtectedPostEditor = withAuth(PostEditor, {
  requiredPermissions: ['post:edit']
});
```

#### **Permission Checking**
```typescript
// ✅ Use Auth feature hooks in UI
import { usePermissions } from '@/features/auth';

const PostActions: React.FC<{ post: Post }> = ({ post }) => {
  const { hasPermission } = usePermissions();
  
  return (
    <div>
      <button onClick={() => editPost(post)}>
        Edit Post
      </button>
      
      {hasPermission('post:delete') && (
        <button onClick={() => deletePost(post.id)}>
          Delete Post
        </button>
      )}
    </div>
  );
};
```

---

## 🧪 **Testing Guidelines**

### **Unit Tests**
```typescript
// ✅ Test business logic only
describe('PostService', () => {
  it('should create post with valid data', async () => {
    const mockRepository = createMockPostRepository();
    const service = new PostService(mockRepository);
    
    const postData = { title: 'Test', content: 'Content' };
    const result = await service.createPost(postData);
    
    expect(result.title).toBe(postData.title);
    expect(mockRepository.create).toHaveBeenCalledWith(postData);
  });
});
```

### **Component Tests**
```typescript
// ✅ Test UI without auth concerns
describe('PostCard', () => {
  it('should display post content', () => {
    const post = { id: '1', title: 'Test', content: 'Content' };
    
    render(<PostCard post={post} />);
    
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
```

### **Integration Tests**
```typescript
// ✅ Test feature with auth mocked
describe('Feed Integration', () => {
  it('should display feed for authenticated user', async () => {
    // Mock auth state
    mockAuthState({
      isAuthenticated: true,
      user: { id: '1', permissions: ['feed:read'] }
    });
    
    render(<FeedPage />);
    
    expect(await screen.findByText('Feed Posts')).toBeInTheDocument();
  });
});
```

---

## 📋 **Checklist for Feature Development**

### **Before Starting**
- [ ] Review feature requirements
- [ ] Identify business entities and rules
- [ ] Define repository interfaces
- [ ] Plan DI container structure

### **During Development**
- [ ] Focus on business logic only
- [ ] Keep interfaces clean (no auth parameters)
- [ ] Write tests for business logic
- [ ] Use Auth feature for protection when needed

### **Before PR**
- [ ] No auth logic in feature code
- [ ] No token management in repositories
- [ ] No permission checks in components
- [ ] Tests cover business logic thoroughly
- [ ] Documentation is updated

---

## 🚀 **Best Practices**

### **Code Organization**
- Keep business logic in domain layer
- Use clean interfaces without auth concerns
- Leverage DI for dependency management
- Write focused, single-responsibility components

### **Error Handling**
```typescript
// ✅ Handle business errors
export class PostService {
  async createPost(postData: PostRequest): Promise<Post> {
    try {
      return await this.postRepository.create(postData);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error; // Re-throw business errors
      }
      throw new BusinessError('Failed to create post', error);
    }
  }
}
```

### **State Management**
```typescript
// ✅ Use feature-specific state
export const usePostState = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Business state management only
  const addPost = useCallback((post: Post) => {
    setPosts(prev => [...prev, post]);
  }, []);
  
  return { posts, loading, addPost };
};
```

---

## 📚 **Related Documentation**

- [Auth Separation Architecture](./AUTH_SEPARATION_ARCHITECTURE.md)
- [DI Container Guidelines](./DI_GUIDELINES.md)
- [Testing Best Practices](../testing/best-practices.md)
- [Code Review Checklist](../development/code-review-checklist.md)

---

## ✅ **Summary**

By following these guidelines, you'll create features that are:

- **Focused**: Pure business logic without auth concerns
- **Maintainable**: Clear separation of responsibilities
- **Testable**: Easier to test without auth complexity
- **Secure**: Auth handled by dedicated Auth feature
- **Consistent**: Follow established patterns across all features

**Remember**: The Auth feature is your security expert. Let it handle authentication and authorization while you focus on delivering great business value!
