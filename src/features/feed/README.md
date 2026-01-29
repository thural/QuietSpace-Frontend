# Feed Feature - Separated Concerns Architecture

## 📋 **Overview**

The Feed feature has been reorganized to separate concerns between **Posts** and **Comments** sub-features, providing better maintainability, clearer boundaries, and improved developer experience.

---

## 🏗️ **New Architecture**

```
src/features/feed/
├── posts/                    # ✨ NEW: Posts sub-feature
│   ├── domain/              # Post domain logic
│   │   ├── entities/        # Post entities and business rules
│   │   ├── repositories/    # Post repository interfaces
│   │   └── services/        # Post domain services
│   ├── data/                # Post data access
│   │   ├── repositories/    # Post repository implementations
│   │   ├── services/        # Post data services
│   │   └── models/          # Post data models
│   ├── application/         # Post application logic
│   │   ├── services/        # Post application services
│   │   └── hooks/           # Post React hooks
│   ├── presentation/        # Post UI components
│   │   ├── components/      # Post components
│   │   └── pages/           # Post pages
│   └── index.ts             # Posts barrel export
├── comments/                # ✨ NEW: Comments sub-feature
│   ├── domain/              # Comment domain logic
│   │   ├── entities/        # Comment entities and business rules
│   │   ├── repositories/    # Comment repository interfaces
│   │   └── services/        # Comment domain services
│   ├── data/                # Comment data access
│   │   ├── repositories/    # Comment repository implementations
│   │   ├── services/        # Comment data services
│   │   └── models/          # Comment data models
│   ├── application/         # Comment application logic
│   │   ├── services/        # Comment application services
│   │   └── hooks/           # Comment React hooks
│   ├── presentation/        # Comment UI components
│   │   ├── components/      # Comment components
│   │   └── pages/           # Comment pages
│   └── index.ts             # Comments barrel export
├── data/                     # Shared data layer
│   ├── di/                   # ✨ MOVED: DI configuration
│   ├── cache/                # Shared caching
│   ├── hooks/                # Shared hooks
│   ├── models/               # Shared models
│   ├── repositories/         # Shared repositories
│   ├── services/             # Shared services
│   └── utils/                # Shared utilities
├── domain/                   # Shared domain
├── application/              # Shared application layer
├── presentation/             # Shared presentation
└── index.ts                  # Main feed export
```

---

## 🎯 **Benefits of Separation**

### **✅ Clear Boundaries**
- **Posts Sub-feature**: Focuses solely on post-related functionality
- **Comments Sub-feature**: Focuses solely on comment-related functionality
- **Shared Layer**: Common functionality shared between sub-features

### **✅ Better Maintainability**
- **Focused Development**: Teams can work on specific sub-features
- **Reduced Coupling**: Clear interfaces between posts and comments
- **Easier Testing**: Isolated functionality for better test coverage

### **✅ Improved Developer Experience**
- **Clear Imports**: Specific imports from sub-features
- **Better Navigation**: Organized structure for easier code discovery
- **Focused Documentation**: Sub-feature specific documentation

---

## 📂 **Sub-Feature Structure**

### **Posts Sub-Feature**
```
posts/
├── domain/
│   ├── entities/PostEntities.ts      # Post entity with business logic
│   ├── repositories/IPostRepository.ts # Post repository interface
│   └── services/                     # Post domain services
├── data/
│   ├── repositories/PostRepository.ts # Post repository implementation
│   ├── services/PostDataService.ts    # Post data service
│   └── models/post.ts                 # Post data models
├── application/
│   ├── services/PostService.ts       # Post application service
│   └── hooks/usePosts.ts              # Post React hooks
├── presentation/
│   ├── components/PostCard.tsx        # Post components
│   └── pages/PostDetailPage.tsx       # Post pages
└── index.ts                          # Posts exports
```

### **Comments Sub-Feature**
```
comments/
├── domain/
│   ├── entities/CommentEntities.ts    # Comment entity with business logic
│   ├── repositories/ICommentRepository.ts # Comment repository interface
│   └── services/                     # Comment domain services
├── data/
│   ├── repositories/CommentRepository.ts # Comment repository implementation
│   ├── services/CommentDataService.ts # Comment data service
│   └── models/comment.ts             # Comment data models
├── application/
│   ├── services/CommentService.ts    # Comment application service
│   └── hooks/useComments.ts          # Comment React hooks
├── presentation/
│   ├── components/CommentSection.tsx # Comment components
│   └── pages/CommentDetailPage.tsx    # Comment pages
└── index.ts                          # Comments exports
```

---

## 🔄 **Usage Patterns**

### **Importing from Sub-Features**
```typescript
// Import specific post functionality
import { Post, PostFactory } from '@/features/feed/posts';
import { usePosts } from '@/features/feed/posts/application/hooks';

// Import specific comment functionality
import { Comment, CommentFactory } from '@/features/feed/comments';
import { useComments } from '@/features/feed/comments/application/hooks';

// Import shared functionality
import { FeedDataService } from '@/features/feed/data';
```

### **Component Usage**
```typescript
// Post component using post-specific hooks
const PostCard: React.FC<{ postId: string }> = ({ postId }) => {
  const { data: post, isLoading } = usePost(postId);
  const { mutate: updatePost } = useUpdatePost();
  
  return (
    <div>
      <h3>{post?.title}</h3>
      <p>{post?.content}</p>
      <button onClick={() => updatePost(postId, { /* updates */ })}>
        Update
      </button>
    </div>
  );
};

// Comment component using comment-specific hooks
const CommentSection: React.FC<{ postId: string }> = ({ postId }) => {
  const { data: comments, isLoading } = useComments({ postId });
  const { mutate: createComment } = useCreateComment();
  
  return (
    <div>
      {comments?.map(comment => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
      <CommentForm onSubmit={createComment} />
    </div>
  );
};
```

---

## 🛠️ **Migration Guide**

### **From Old Structure to New**

#### **Before**
```typescript
// Mixed imports from feed
import { Post, Comment } from '@/features/feed/domain/entities';
import { PostRepository, CommentRepository } from '@/features/feed/data/repositories';
import { usePost, useComment } from '@/features/feed/application/hooks';
```

#### **After**
```typescript
// Separated imports from sub-features
import { Post } from '@/features/feed/posts/domain/entities';
import { Comment } from '@/features/feed/comments/domain/entities';
import { PostRepository } from '@/features/feed/posts/data/repositories';
import { CommentRepository } from '@/features/feed/comments/data/repositories';
import { usePost } from '@/features/feed/posts/application/hooks';
import { useComment } from '@/features/feed/comments/application/hooks';
```

---

## 📊 **Data Flow Architecture**

### **Posts Sub-Feature Flow**
```
Post Component → usePost Hook → PostService → PostRepository → API
```

### **Comments Sub-Feature Flow**
```
Comment Component → useComment Hook → CommentService → CommentRepository → API
```

### **Shared Integration**
```
Feed Component
├── Posts Sub-feature
│   └── Post Components → Post Services → Post Repositories
└── Comments Sub-feature
    └── Comment Components → Comment Services → Comment Repositories
```

---

## 🧪 **Testing Strategy**

### **Unit Testing**
- **Posts**: Test post entities, services, and hooks in isolation
- **Comments**: Test comment entities, services, and hooks in isolation
- **Shared**: Test shared utilities and common functionality

### **Integration Testing**
- **Post-Comment Integration**: Test interactions between posts and comments
- **End-to-End**: Test complete user workflows across sub-features

---

## 🎯 **Development Guidelines**

### **Adding New Post Features**
1. Add entity logic to `posts/domain/entities/`
2. Add repository interface to `posts/domain/repositories/`
3. Implement repository in `posts/data/repositories/`
4. Add service logic in `posts/application/services/`
5. Create React hooks in `posts/application/hooks/`
6. Build UI components in `posts/presentation/components/`

### **Adding New Comment Features**
1. Add entity logic to `comments/domain/entities/`
2. Add repository interface to `comments/domain/repositories/`
3. Implement repository in `comments/data/repositories/`
4. Add service logic in `comments/application/services/`
5. Create React hooks in `comments/application/hooks/`
6. Build UI components in `comments/presentation/components/`

---

## 📚 **Related Documentation**

- [Feed Data Directory Structure](./data/README.md)
- [Auth Separation Architecture](../../../docs/architecture/AUTH_SEPARATION_ARCHITECTURE.md)
- [Feature Development Guidelines](../../../docs/development/FEATURE_DEVELOPMENT_GUIDELINES.md)
- [DI Container Guidelines](../../../docs/architecture/DI_GUIDELINES.md)

---

## ✅ **Summary**

The separated concerns architecture provides:

- **🎯 Clear Boundaries**: Posts and comments as distinct sub-features
- **🔧 Better Organization**: Logical grouping of related functionality
- **📈 Improved Maintainability**: Easier to understand and modify
- **🧪 Better Testing**: Isolated functionality for focused testing
- **👥 Team Collaboration**: Teams can work on specific sub-features

This structure makes the Feed feature more scalable, maintainable, and easier to develop while maintaining clear separation of concerns between posts and comments functionality.
