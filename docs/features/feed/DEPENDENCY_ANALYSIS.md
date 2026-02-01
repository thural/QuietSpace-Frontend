# Feed Feature Dependency Analysis

## 📋 **External Dependencies on Feed Feature**

### **Features that Import from Feed:**

#### **1. Notification Feature**
```typescript
// features/notification/data/repositories/NotificationRepository.ts
import {ReactionType} from "@/features/feed/data/models/reaction";

// features/notification/data/repositories/MockNotificationRepository.ts  
import type { ReactionType } from '@/features/feed/data/models/reaction';
```
**Impact**: HIGH - Need to move ReactionType to shared

#### **2. Chat Feature**
```typescript
// features/chat/presentation/components/messages/MessageList.tsx
import PostMessageCard from "@/features/feed/presentation/components/post/PostMessageCard";

// features/chat/performance/ChatPerformanceTest.tsx
import {usePerformanceMonitor} from '@/features/feed/performance';
```
**Impact**: MEDIUM - Need to move PostMessageCard and performance utilities

#### **3. Profile Feature**
```typescript
// features/profile/presentation/components/list/UserPostList.tsx
import PostCard from "@/features/feed/presentation/components/post/PostCard";
import PostReplyCard from "@/features/feed/presentation/components/post/PostReplyCard";
import RepostCard from "@/features/feed/presentation/components/repost/RepostCard";
```
**Impact**: HIGH - Need to move post components to post feature

---

## 📊 **Internal Feed Dependencies**

### **Cross-Sub-Feature Dependencies:**

#### **Posts → Comments:**
```typescript
// posts/data/services/PostDataService.ts
import type { ICommentRepository } from '@/features/feed/comments/domain/repositories/ICommentRepository';

// posts/application/services/PostService.ts
import { CommentRepository } from '@/features/feed/comments/data/repositories/CommentRepository';
```
**Impact**: HIGH - Post feature depends on comment feature

#### **Posts → Shared Data:**
```typescript
// posts/data/repositories/PostRepository.ts
import { ReactionRequest } from "@/features/feed/data/models/reaction";

// posts/data/repositories/MockPostRepository.ts
import type { ReactionRequest } from '@/features/feed/data/models/reaction';
import { ReactionType } from '@/features/feed/data/models/types/reactionNative';
```
**Impact**: HIGH - Need to move reaction types to shared

#### **Application Hooks → Feed Data:**
```typescript
// Multiple application hooks import from feed data models
import { PollResponse, PollOption, VoteBody } from "@/features/feed/data/models/post";
import { CommentResponse } from "@/features/feed/data/models/comment";
import { ReactionType } from "@/features/feed/data/models/reactionNative";
```
**Impact**: HIGH - Need to move data models to respective features

---

## 🎯 **Shared Components Identification**

### **Types that Need to Move to Shared:**

#### **Reaction Types**
```typescript
// Currently in: features/feed/data/models/reaction.ts
// Needs to move to: features/shared/types/reaction.ts
- ReactionType enum
- ReactionRequest interface
- ReactionResponse interface
```

#### **Common Post/Comment Types**
```typescript
// Currently in: features/feed/data/models/
// Needs to move to: features/shared/types/
- Common base interfaces
- Shared enums
- Utility types
```

#### **Performance Utilities**
```typescript
// Currently in: features/feed/performance/
// Needs to move to: features/shared/utils/performance/
- usePerformanceMonitor hook
- Performance testing utilities
```

---

## 🔄 **Feature Dependency Matrix**

| Feature | Depends On | Impact Level |
|---------|-------------|-------------|
| **Post** | Comment | HIGH |
| **Post** | Shared (Reaction) | HIGH |
| **Comment** | Shared (Reaction) | MEDIUM |
| **Feed** | Post | HIGH |
| **Feed** | Comment | HIGH |
| **Notification** | Shared (Reaction) | HIGH |
| **Chat** | Post (PostMessageCard) | MEDIUM |
| **Profile** | Post (PostCard) | HIGH |

---

## 🚨 **Critical Dependencies**

### **1. ReactionType - Most Critical**
- Used by: Notification, Post, Comment features
- **Action**: Move to `features/shared/types/reaction.ts`

### **2. Post Components - High Impact**
- Used by: Profile, Chat features
- **Action**: Move to `features/post/presentation/components/`

### **3. Post-Comment Coupling - Architecture Risk**
- Post service depends on comment repository
- **Action**: Redesign to use event system or shared interfaces

---

## 📋 **Migration Priority**

### **Priority 1: Shared Types**
1. Move `ReactionType` and related types to shared
2. Move common base interfaces to shared
3. Update all import statements

### **Priority 2: Component Migration**
1. Move post components to post feature
2. Update profile and chat imports
3. Test component functionality

### **Priority 3: Feature Separation**
1. Extract post feature (with shared dependencies)
2. Extract comment feature
3. Restructure feed feature

### **Priority 4: Integration**
1. Update cross-feature communication
2. Test all integrations
3. Update documentation

---

## 🎯 **Immediate Actions Required**

### **Before Feature Separation:**

1. **Move Reaction Types to Shared**
   ```bash
   mkdir -p src/features/shared/types
   mv src/features/feed/data/models/reaction.ts src/features/shared/types/
   ```

2. **Move Performance Utilities**
   ```bash
   mkdir -p src/features/shared/utils/performance
   mv src/features/feed/performance/* src/features/shared/utils/performance/
   ```

3. **Update External Imports**
   - Update notification feature imports
   - Update chat feature imports
   - Update profile feature imports

### **During Feature Separation:**

1. **Handle Post-Comment Coupling**
   - Create shared interfaces
   - Use event system for communication
   - Avoid direct dependencies

2. **Maintain Backward Compatibility**
   - Keep old imports working during transition
   - Use barrel exports for smooth migration
   - Update incrementally

---

## ✅ **Dependencies Analysis Complete**

**Status**: 📋 **ANALYSIS COMPLETE**  
**Next Action**: 🚀 **BEGIN SHARED TYPES EXTRACTION**  
**Critical Dependencies**: 3 identified  
**External Features Affected**: 3 (Notification, Chat, Profile)
