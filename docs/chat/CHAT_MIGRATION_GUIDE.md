# Chat Feature Migration Guide

## Overview

This guide helps developers migrate from legacy chat implementations to the new enterprise-grade Chat feature. It covers breaking changes, new features, and step-by-step migration instructions.

## Migration Checklist

- [ ] Review breaking changes
- [ ] Update imports
- [ ] Replace legacy hooks
- [ ] Configure new features
- [ ] Add error handling
- [ ] Implement performance monitoring
- [ ] Test thoroughly

---

## Breaking Changes

### 1. Hook Signature Changes

#### Before (Legacy)
```typescript
// Legacy hooks with different signatures
const { chats, messages } = useReactQueryChat(userId);
const { data, loading } = useReactQueryChatSimple(userId);
const chat = useChat(userId);
```

#### After (Modern)
```typescript
// Unified hook with enhanced signature
const chat = useUnifiedChat(userId, chatId?, options?);
const { chats, messages, error, getMetrics } = chat;
```

### 2. Real-time Configuration

#### Before (Implicit)
```typescript
// Real-time was not configurable
const chat = useReactQueryChat(userId);
```

#### After (Explicit)
```typescript
// Real-time is opt-in with configuration
const chat = useUnifiedChat(userId, chatId, {
    enableRealTime: true,
    enableOptimisticUpdates: true
});
```

### 3. Error Handling

#### Before (Basic)
```typescript
const { error, refetch } = useReactQueryChat(userId);
if (error) {
    console.error(error);
}
```

#### After (Advanced)
```typescript
const { error, retryFailedQueries, getErrorSummary } = useUnifiedChat(userId);
if (error) {
    const errors = getErrorSummary?.();
    await retryFailedQueries?.();
}
```

---

## Step-by-Step Migration

### Step 1: Update Imports

#### Remove Legacy Imports
```typescript
// Remove these imports
import { useReactQueryChat } from '@/features/chat/application/hooks/useReactQueryChat';
import { useReactQueryChatSimple } from '@/features/chat/application/hooks/useReactQueryChatSimple';
import { useChat } from '@/features/chat/application/hooks/useChat';
```

#### Add Modern Import
```typescript
// Add this import
import { useUnifiedChat } from '@/features/chat/application/hooks/useUnifiedChat';
```

### Step 2: Replace Basic Usage

#### Before
```typescript
function ChatComponent({ userId }) {
    const { chats, messages, isLoading, error } = useReactQueryChat(userId);
    
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    
    return (
        <div>
            {/* Chat content */}
        </div>
    );
}
```

#### After
```typescript
function ChatComponent({ userId, chatId }) {
    const chat = useUnifiedChat(userId, chatId);
    
    if (chat.isLoading) return <div>Loading...</div>;
    if (chat.error) return <div>Error: {chat.error.message}</div>;
    
    return (
        <div>
            {/* Chat content */}
        </div>
    );
}
```

### Step 3: Add Multi-Chat Support

#### Before (Single Chat)
```typescript
// Legacy hooks couldn't handle multiple chats
const { messages } = useReactQueryChat(userId);
```

#### After (Multi-Chat)
```typescript
// Modern hook supports multiple chats
const chat1 = useUnifiedChat(userId, 'chat-1');
const chat2 = useUnifiedChat(userId, 'chat-2');
```

### Step 4: Configure Cache Strategy

#### Before (Fixed Caching)
```typescript
// No configuration options
const chat = useReactQueryChat(userId);
```

#### After (Configurable Caching)
```typescript
// Choose cache strategy based on use case
const chat = useUnifiedChat(userId, chatId, {
    cacheStrategy: 'aggressive', // or 'moderate', 'conservative'
    enableRealTime: true,
    enableOptimisticUpdates: true
});
```

### Step 5: Add Performance Monitoring

#### Before (No Monitoring)
```typescript
// No built-in performance tracking
const chat = useReactQueryChat(userId);
```

#### After (Built-in Monitoring)
```typescript
const chat = useUnifiedChat(userId, chatId);

// Monitor performance
const metrics = chat.getMetrics?.();
const summary = chat.getPerformanceSummary?.();

// Use performance data
if (summary?.overall === 'poor') {
    console.warn('Performance issues detected:', summary.issues);
}
```

### Step 6: Enhance Error Handling

#### Before (Basic Error Handling)
```typescript
const { error, refetch } = useReactQueryChat(userId);

if (error) {
    console.error('Chat error:', error);
    refetch(); // Manual retry
}
```

#### After (Advanced Error Handling)
```typescript
const { error, retryFailedQueries, getErrorSummary } = useUnifiedChat(userId);

if (error) {
    // Get detailed error information
    const errors = getErrorSummary?.();
    console.error('Chat errors:', errors);
    
    // Automatic retry with recovery
    await retryFailedQueries?.();
}
```

---

## Feature Migration Mapping

### Legacy Features → Modern Equivalents

| Legacy Feature | Modern Equivalent | Enhancement |
|---------------|------------------|-------------|
| `useReactQueryChat` | `useUnifiedChat` | Multi-chat support, performance monitoring |
| `useReactQueryChatSimple` | `useUnifiedChat` | Same functionality + enterprise features |
| `useChat` | `useUnifiedChat` | Enhanced with real-time and caching |
| Basic error handling | Advanced error recovery | Retry logic, error summaries |
| Fixed caching | Configurable strategies | Aggressive, moderate, conservative options |
| No performance tracking | Built-in metrics | Query times, cache hit rates, user interactions |
| Manual WebSocket handling | Automatic integration | Connection management, subscriptions |

---

## Configuration Migration

### Cache Strategy Selection

#### For High-Frequency Apps
```typescript
const chat = useUnifiedChat(userId, chatId, {
    cacheStrategy: 'aggressive',
    enableRealTime: true
});
```

#### For Real-time Collaboration
```typescript
const chat = useUnifiedChat(userId, chatId, {
    cacheStrategy: 'conservative',
    enableRealTime: true,
    refetchInterval: {
        messages: 5000  // 5 seconds for real-time updates
    }
});
```

#### For Resource-Constrained Environments
```typescript
const chat = useUnifiedChat(userId, chatId, {
    cacheStrategy: 'moderate',
    enableRealTime: false  // Disable to save resources
});
```

### Performance Optimization

#### Monitor and Adjust
```typescript
function OptimizedChat({ userId, chatId }) {
    const chat = useUnifiedChat(userId, chatId, {
        cacheStrategy: 'moderate'
    });

    // Monitor performance
    const summary = chat.getPerformanceSummary?.();
    
    // Adjust strategy based on performance
    useEffect(() => {
        if (summary?.overall === 'poor') {
            // Switch to more conservative strategy
            console.log('Switching to conservative caching');
        }
    }, [summary]);

    return <ChatUI chat={chat} />;
}
```

---

## Testing Migration

### Unit Test Updates

#### Before (Legacy Tests)
```typescript
import { useReactQueryChat } from '@/features/chat/application/hooks/useReactQueryChat';

test('should load chats', async () => {
    const { result } = renderHook(() => useReactQueryChat('user-123'));
    // Test legacy functionality
});
```

#### After (Modern Tests)
```typescript
import { useUnifiedChat } from '@/features/chat/application/hooks/useUnifiedChat';

test('should load chats with metrics', async () => {
    const { result } = renderHook(() => useUnifiedChat('user-123'));
    
    await waitFor(() => {
        expect(result.current.chats).toBeDefined();
        expect(result.current.getMetrics).toBeDefined();
    });
});

test('should handle performance monitoring', async () => {
    const { result } = renderHook(() => useUnifiedChat('user-123'));
    
    const metrics = result.current.getMetrics?.();
    expect(metrics).toBeDefined();
    expect(metrics?.queryMetrics).toBeDefined();
});
```

### Integration Test Updates

#### Add Performance Testing
```typescript
test('should track performance metrics', async () => {
    const { result } = renderHook(() => useUnifiedChat('user-123', 'chat-456'));
    
    // Perform operations
    await act(async () => {
        await result.current.createChat({
            userIds: ['user-123'],
            text: 'Test message'
        });
    });
    
    // Verify metrics were recorded
    const metrics = result.current.getMetrics?.();
    expect(metrics?.mutationMetrics.totalMutations).toBe(1);
});
```

---

## Common Migration Patterns

### Pattern 1: Gradual Migration

```typescript
// Phase 1: Replace hook but keep same interface
function ChatComponent({ userId }) {
    // Use new hook but maintain old interface
    const chat = useUnifiedChat(userId);
    const { chats, messages, isLoading, error } = chat;
    
    // Existing component logic unchanged
    return <ChatUI chats={chats} messages={messages} loading={isLoading} error={error} />;
}

// Phase 2: Add new features
function EnhancedChatComponent({ userId, chatId }) {
    const chat = useUnifiedChat(userId, chatId, {
        enableRealTime: true,
        enableOptimisticUpdates: true
    });
    
    // Use new features
    return <ModernChatUI chat={chat} />;
}
```

### Pattern 2: Feature Flag Migration

```typescript
function ChatComponent({ userId, chatId }) {
    const useNewChat = useFeatureFlag('new-chat-system');
    
    if (useNewChat) {
        return <ModernChat userId={userId} chatId={chatId} />;
    } else {
        return <LegacyChat userId={userId} />;
    }
}

function ModernChat({ userId, chatId }) {
    const chat = useUnifiedChat(userId, chatId);
    return <ChatUI chat={chat} />;
}

function LegacyChat({ userId }) {
    const { chats, messages } = useReactQueryChat(userId);
    return <OldChatUI chats={chats} messages={messages} />;
}
```

### Pattern 3: Adapter Pattern

```typescript
// Create adapter for legacy interface
function useLegacyChatAdapter(userId) {
    const chat = useUnifiedChat(userId);
    
    return {
        // Legacy interface
        chats: chat.chats,
        messages: chat.messages,
        isLoading: chat.isLoading,
        error: chat.error,
        refetch: chat.retryFailedQueries,
        
        // New features (optional)
        metrics: chat.getMetrics?.(),
        performance: chat.getPerformanceSummary?.()
    };
}

// Use adapter in existing components
function ExistingChatComponent({ userId }) {
    const chatData = useLegacyChatAdapter(userId);
    // Component logic unchanged
}
```

---

## Troubleshooting Migration Issues

### Issue 1: Missing Chat ID

#### Problem
```typescript
// Error: Messages not loading
const chat = useUnifiedChat(userId); // Missing chatId
```

#### Solution
```typescript
// Fix: Provide chatId for message operations
const chat = useUnifiedChat(userId, chatId);
```

### Issue 2: Performance Degradation

#### Problem
```typescript
// App feels slower after migration
const chat = useUnifiedChat(userId, chatId);
```

#### Solution
```typescript
// Fix: Optimize cache strategy
const chat = useUnifiedChat(userId, chatId, {
    cacheStrategy: 'aggressive',
    enableRealTime: false // Disable if not needed
});
```

### Issue 3: WebSocket Connection Issues

#### Problem
```typescript
// Real-time updates not working
const chat = useUnifiedChat(userId, chatId, { enableRealTime: true });
```

#### Solution
```typescript
// Fix: Check WebSocket server and network
const chat = useUnifiedChat(userId, chatId, { 
    enableRealTime: true 
});

// Monitor connection
const metrics = chat.getMetrics?.();
console.log('WebSocket metrics:', metrics?.websocketMetrics);
```

### Issue 4: Memory Leaks

#### Problem
```typescript
// Memory usage increases over time
```

#### Solution
```typescript
// Fix: Reset metrics periodically
useEffect(() => {
    const interval = setInterval(() => {
        chat.resetMetrics?.();
    }, 60000); // Reset every minute
    
    return () => clearInterval(interval);
}, [chat]);
```

---

## Validation Checklist

After migration, verify:

### Functionality
- [ ] Chat list loads correctly
- [ ] Messages load and display
- [ ] New chats can be created
- [ ] Messages can be sent
- [ ] Participants can be managed

### Performance
- [ ] Cache hit rate > 70%
- [ ] Average query time < 2 seconds
- [ ] No memory leaks
- [ ] Real-time updates work (if enabled)

### Error Handling
- [ ] Errors are displayed gracefully
- [ ] Retry functionality works
- [ ] Error summaries are helpful
- [ ] Network issues are handled

### Monitoring
- [ ] Metrics are collected
- [ ] Performance summaries are accurate
- [ ] Issues are detected
- [ ] Recommendations are helpful

---

## Rollback Plan

If migration issues arise:

### 1. Immediate Rollback
```typescript
// Revert to legacy imports
import { useReactQueryChat } from '@/features/chat/application/hooks/useReactQueryChat';

// Use legacy implementation
const { chats, messages } = useReactQueryChat(userId);
```

### 2. Feature Flag Rollback
```typescript
// Disable new features
const chat = useUnifiedChat(userId, chatId, {
    enableRealTime: false,
    enableOptimisticUpdates: false,
    cacheStrategy: 'moderate'
});
```

### 3. Gradual Rollback
```typescript
// Roll back component by component
function ChatComponent({ userId }) {
    // Use legacy implementation temporarily
    return <LegacyChatComponent userId={userId} />;
}
```

---

## Support Resources

### Documentation
- [API Documentation](./CHAT_API_DOCUMENTATION.md)
- [Quick Start Guide](./CHAT_QUICK_START.md)
- [Implementation Examples](./CHAT_EXAMPLES.md)

### Code Examples
- `src/features/chat/__tests__/` - Test examples
- `src/features/chat/application/hooks/` - Hook implementations
- `docs/` - Additional documentation

### Troubleshooting
- Check browser console for errors
- Monitor network requests
- Review performance metrics
- Enable debug logging in DI container

---

## Next Steps

After successful migration:

1. **Optimize Performance**: Fine-tune cache strategies based on usage patterns
2. **Add Advanced Features**: Implement typing indicators, online status
3. **Enhance Monitoring**: Add custom metrics and alerts
4. **Scale Testing**: Test with larger datasets and concurrent users
5. **Documentation**: Update team documentation and onboarding materials

---

## Migration Timeline

### Week 1: Preparation
- Review breaking changes
- Update development environment
- Create feature flags
- Plan testing strategy

### Week 2: Implementation
- Update imports
- Replace basic usage
- Add new features
- Implement error handling

### Week 3: Testing & Validation
- Unit tests
- Integration tests
- Performance testing
- User acceptance testing

### Week 4: Deployment & Monitoring
- Feature flag rollout
- Performance monitoring
- Issue resolution
- Full rollout

---

## Success Metrics

Migration success is measured by:

- **Functionality**: All features work as before
- **Performance**: Improved or maintained performance
- **Stability**: Reduced error rates and crashes
- **Developer Experience**: Better debugging and monitoring
- **User Experience**: Faster, more responsive chat interface

---

**Happy migrating!** 🚀

For questions or issues, refer to the support resources or contact the development team.
