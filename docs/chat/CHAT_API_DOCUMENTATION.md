# Chat Feature API Documentation

## Overview

The Chat feature provides enterprise-grade real-time messaging capabilities with advanced caching, performance monitoring, and comprehensive error handling. This documentation covers the complete API surface, usage patterns, and best practices.

## Table of Contents

1. [Core Hooks](#core-hooks)
2. [Services](#services)
3. [Configuration](#configuration)
4. [Performance Monitoring](#performance-monitoring)
5. [Error Handling](#error-handling)
6. [Real-time Features](#real-time-features)
7. [Migration Guide](#migration-guide)
8. [Examples](#examples)

---

## Core Hooks

### useUnifiedChat

The main hook for chat functionality. Provides unified access to all chat operations with enterprise features.

#### Signature

```typescript
export const useUnifiedChat = (
    userId: string,
    chatId?: string,
    options?: UseChatOptions
): UnifiedChatState & UnifiedChatActions
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | The current user's ID |
| `chatId` | `string` (optional) | Specific chat ID for message/participant operations |
| `options` | `UseChatOptions` (optional) | Configuration options |

#### Options

```typescript
interface UseChatOptions {
    enableRealTime?: boolean;        // Enable WebSocket real-time updates
    enableOptimisticUpdates?: boolean; // Enable optimistic UI updates
    cacheStrategy?: 'aggressive' | 'moderate' | 'conservative';
    refetchInterval?: {
        chats?: number;
        messages?: number;
        participants?: number;
        unreadCount?: number;
    };
}
```

#### Return Value

```typescript
interface UnifiedChatState {
    // Data
    chats: any;
    messages: any;
    participants: any;
    unreadCount: any;
    isLoading: boolean;
    error: Error | null;

    // Query methods
    prefetchChats?: (userId: string) => Promise<void>;
    prefetchMessages?: (chatId: ResId) => Promise<void>;
    invalidateCache?: () => void;

    // Error handling
    retryFailedQueries?: () => Promise<void>;
    getErrorSummary?: () => Array<{ type: string; error: string }>;

    // Performance monitoring
    getMetrics?: () => ChatMetrics;
    getPerformanceSummary?: () => PerformanceSummary;
    resetMetrics?: () => void;
}

interface UnifiedChatActions {
    createChat: (chatData: CreateChatRequest) => Promise<ChatResponse>;
    deleteChat: (chatId: ResId) => Promise<void>;
    sendMessage: (data: { chatId: string; messageData: any }) => Promise<MessageResponse>;
    updateChatSettings: (chatId: ResId, settings: any) => Promise<ChatResponse>;
    searchChats: (query: string) => Promise<ChatResponse[]>;
    addParticipant: (chatId: ResId, participantId: string) => Promise<ChatResponse>;
    removeParticipant: (chatId: ResId, participantId: string) => Promise<ChatResponse>;
    markMessagesAsRead: (chatId: ResId, messageIds: string[]) => Promise<void>;
}
```

---

## Services

### ChatDataService

Handles data operations with caching and WebSocket integration.

#### Key Methods

```typescript
class ChatDataService {
    async getChats(userId: string, token: JwtToken): Promise<ChatList>;
    async getMessages(chatId: ResId, page: number, token: JwtToken): Promise<PagedMessage>;
    async getChatParticipants(chatId: ResId, token: JwtToken): Promise<UserResponse[]>;
    async getUnreadCount(userId: string, token: JwtToken): Promise<number>;
    async deleteChat(chatId: ResId, token: JwtToken): Promise<void>;
    async markMessagesAsRead(chatId: ResId, messageIds: string[], token: JwtToken): Promise<void>;
}
```

### ChatFeatureService

Handles business logic, validation, and orchestration.

#### Key Methods

```typescript
class ChatFeatureService {
    async createChatWithValidation(chatData: CreateChatRequest, token: JwtToken): Promise<ChatResponse>;
    async sendMessageWithValidation(chatId: ResId, messageData: any, token: JwtToken): Promise<MessageResponse>;
    async updateChatSettings(chatId: ResId, settings: any, token: JwtToken): Promise<ChatResponse>;
    async searchChats(query: string, userId: string, token: JwtToken): Promise<ChatResponse[]>;
    async addParticipant(chatId: ResId, participantId: string, token: JwtToken): Promise<ChatResponse>;
    async removeParticipant(chatId: ResId, participantId: string, token: JwtToken): Promise<ChatResponse>;
}
```

### ChatMetricsService

Provides comprehensive performance monitoring and analytics.

#### Key Methods

```typescript
class ChatMetricsService {
    recordQuery(action: string, duration: number, success: boolean, fromCache: boolean): void;
    recordMutation(action: string, duration: number, success: boolean, optimistic: boolean, rollback: boolean): void;
    recordInteraction(action: 'message' | 'typing' | 'search', metadata?: Record<string, any>): void;
    recordWebSocketEvent(action: string, latency?: number): void;
    getMetrics(): ChatMetrics;
    getPerformanceSummary(): PerformanceSummary;
    resetMetrics(): void;
}
```

### WebSocketService

Handles real-time WebSocket communication.

#### Key Methods

```typescript
class WebSocketService {
    async connect(url: string): Promise<void>;
    disconnect(): void;
    subscribe(pattern: string, callback: (message: WebSocketMessage) => void): () => void;
    unsubscribe(pattern: string): void;
    send(message: any): void;
    isConnected(): boolean;
}
```

---

## Configuration

### Cache Strategies

#### Aggressive Strategy
- **Chats**: 15 minutes cache time
- **Messages**: 12.5 minutes cache time
- **Participants**: 10 minutes cache time
- **Unread Count**: 7.5 minutes cache time

#### Moderate Strategy (Default)
- **All Data**: 5 minutes cache time

#### Conservative Strategy
- **Chats**: 2.5 minutes cache time
- **Messages**: 1.5 minutes cache time
- **Participants**: 2 minutes cache time
- **Unread Count**: 1 minute cache time

### Real-time Mode

When enabled, uses shorter stale times:
- **Messages**: 15 seconds stale time
- **Chats**: 1 minute stale time
- **Participants**: 30 seconds stale time
- **Unread Count**: 9 seconds stale time

---

## Performance Monitoring

### Metrics Types

#### Query Metrics
```typescript
interface QueryMetrics {
    totalQueries: number;
    averageQueryTime: number;
    slowQueries: number;        // > 2 seconds
    cacheHitRate: number;
    errorRate: number;
}
```

#### Mutation Metrics
```typescript
interface MutationMetrics {
    totalMutations: number;
    averageMutationTime: number;
    optimisticUpdateRate: number;
    rollbackRate: number;
    errorRate: number;
}
```

#### Cache Metrics
```typescript
interface CacheMetrics {
    totalCacheHits: number;
    totalCacheMisses: number;
    averageCacheAccessTime: number;
    cacheSize: number;
    evictionRate: number;
}
```

#### WebSocket Metrics
```typescript
interface WebSocketMetrics {
    connectionUptime: number;
    messagesReceived: number;
    messagesSent: number;
    reconnectionAttempts: number;
    averageLatency: number;
}
```

#### User Interaction Metrics
```typescript
interface InteractionMetrics {
    messagesPerSession: number;
    averageSessionDuration: number;
    typingIndicatorUsage: number;
    searchQueries: number;
}
```

### Performance Summary

```typescript
interface PerformanceSummary {
    overall: 'excellent' | 'good' | 'fair' | 'poor';
    issues: string[];
    recommendations: string[];
}
```

---

## Error Handling

### Error Types

#### Authentication Errors (401)
- User needs to re-login
- Token expired or invalid

#### Authorization Errors (403)
- Insufficient permissions
- Not a chat participant

#### Not Found Errors (404)
- Chat doesn't exist
- Message not found

#### Payload Too Large (413)
- Message exceeds size limits
- Consider compression or splitting

#### Server Errors (500+)
- Temporary server issues
- Retry may be appropriate

### Error Recovery

#### Automatic Retry
- Queries: Built-in retry logic with exponential backoff
- Mutations: Manual retry via `retryFailedQueries()`

#### Manual Recovery
```typescript
// Get error summary
const errors = chat.getErrorSummary?.();
console.log('Errors:', errors);

// Retry failed operations
await chat.retryFailedQueries?.();
```

---

## Real-time Features

### WebSocket Integration

#### Connection Management
```typescript
// Enable real-time updates
const chat = useUnifiedChat('user-123', 'chat-456', {
    enableRealTime: true
});

// WebSocket automatically connects and subscribes to:
// - chat:chat-456 (new messages)
// - user:user-123 (user-specific updates)
```

#### Message Types
```typescript
interface WebSocketMessage {
    type: string;
    data: any;
    timestamp: number;
    chatId?: string;
    userId?: string;
}
```

#### Common Message Types
- `new_message`: New message in chat
- `message_read`: Message marked as read
- `user_typing`: User is typing
- `user_online`: User came online
- `user_offline`: User went offline
- `chat_updated`: Chat metadata updated

---

## Migration Guide

### From Legacy Chat Hooks

#### Before (Legacy)
```typescript
const { chats, messages, createChat } = useReactQueryChat(userId);
```

#### After (Modern)
```typescript
const chat = useUnifiedChat('user-123', 'chat-456', {
    enableRealTime: true,
    cacheStrategy: 'aggressive',
    enableOptimisticUpdates: true
});

const { chats, messages, createChat, error, getMetrics } = chat;
```

### Key Differences

1. **Multi-Chat Support**: Pass `chatId` for chat-specific operations
2. **Real-time**: Enable WebSocket updates
3. **Performance**: Built-in metrics and monitoring
4. **Error Handling**: Comprehensive error recovery
5. **Caching**: Advanced cache strategies

---

## Examples

### Basic Chat Usage

```typescript
function ChatComponent({ userId, chatId }) {
    const chat = useUnifiedChat(userId, chatId);

    if (chat.isLoading) return <div>Loading...</div>;
    if (chat.error) return <div>Error: {chat.error.message}</div>;

    return (
        <div>
            <div>
                <h3>Messages</h3>
                {chat.messages?.pages?.map(page => 
                    page.content?.map(msg => (
                        <div key={msg.id}>{msg.text}</div>
                    ))
                )}
            </div>
            
            <div>
                <h3>Participants</h3>
                {chat.participants?.map(p => (
                    <div key={p.id}>{p.username}</div>
                ))}
            </div>
            
            <button onClick={() => chat.sendMessage({
                chatId,
                messageData: { content: 'Hello!' }
            })}>
                Send Message
            </button>
        </div>
    );
}
```

### Advanced Configuration

```typescript
function AdvancedChatComponent({ userId }) {
    const chat = useUnifiedChat(userId, undefined, {
        enableRealTime: true,
        enableOptimisticUpdates: true,
        cacheStrategy: 'aggressive',
        refetchInterval: {
            chats: 30000,        // 30 seconds
            messages: 10000,      // 10 seconds
            participants: 20000,  // 20 seconds
            unreadCount: 5000     // 5 seconds
        }
    });

    // Performance monitoring
    const metrics = chat.getMetrics?.();
    const summary = chat.getPerformanceSummary?.();

    return (
        <div>
            <div>Performance: {summary?.overall}</div>
            {summary?.issues.map(issue => (
                <div key={issue} style={{ color: 'orange' }}>
                    Issue: {issue}
                </div>
            ))}
            
            <button onClick={() => chat.resetMetrics?.()}>
                Reset Metrics
            </button>
        </div>
    );
}
```

### Error Handling

```typescript
function ChatWithErrorHandling({ userId, chatId }) {
    const chat = useUnifiedChat(userId, chatId);

    const handleRetry = async () => {
        try {
            await chat.retryFailedQueries?.();
        } catch (error) {
            console.error('Retry failed:', error);
        }
    };

    const errors = chat.getErrorSummary?.();

    return (
        <div>
            {chat.error && (
                <div style={{ color: 'red' }}>
                    <h4>Error occurred</h4>
                    <p>{chat.error.message}</p>
                    <button onClick={handleRetry}>Retry</button>
                    
                    {errors?.map((err, index) => (
                        <div key={index}>
                            {err.type}: {err.error}
                        </div>
                    ))}
                </div>
            )}
            
            {/* Rest of chat UI */}
        </div>
    );
}
```

### Performance Monitoring Dashboard

```typescript
function PerformanceDashboard() {
    const chat = useUnifiedChat('user-123');
    const [showDetails, setShowDetails] = useState(false);

    const metrics = chat.getMetrics?.();
    const summary = chat.getPerformanceSummary?.();

    return (
        <div>
            <h3>Chat Performance</h3>
            
            <div>Overall: {summary?.overall}</div>
            
            {summary?.issues.length > 0 && (
                <div>
                    <h4>Issues:</h4>
                    {summary.issues.map((issue, index) => (
                        <div key={index} style={{ color: 'orange' }}>
                            {issue}
                        </div>
                    ))}
                </div>
            )}

            {summary?.recommendations.length > 0 && (
                <div>
                    <h4>Recommendations:</h4>
                    {summary.recommendations.map((rec, index) => (
                        <div key={index} style={{ color: 'blue' }}>
                            {rec}
                        </div>
                    ))}
                </div>
            )}

            <button onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? 'Hide' : 'Show'} Details
            </button>

            {showDetails && metrics && (
                <div>
                    <h4>Detailed Metrics</h4>
                    <div>Queries: {metrics.queryMetrics.totalQueries}</div>
                    <div>Avg Query Time: {metrics.queryMetrics.averageQueryTime.toFixed(2)}ms</div>
                    <div>Cache Hit Rate: {(metrics.queryMetrics.cacheHitRate * 100).toFixed(1)}%</div>
                    <div>Mutations: {metrics.mutationMetrics.totalMutations}</div>
                    <div>Messages Sent: {metrics.interactionMetrics.messagesPerSession}</div>
                </div>
            )}
        </div>
    );
}
```

---

## Best Practices

### Performance Optimization

1. **Choose appropriate cache strategy**:
   - `aggressive` for frequently accessed data
   - `conservative` for real-time sensitive data
   - `moderate` for balanced performance

2. **Enable real-time only when needed**:
   - Reduces server load
   - Improves battery life on mobile
   - Conserves bandwidth

3. **Monitor performance regularly**:
   - Use `getPerformanceSummary()` for quick health checks
   - Track metrics over time
   - Address performance issues proactively

### Error Handling

1. **Always handle error states**:
   ```typescript
   if (chat.error) {
       // Show user-friendly error message
       // Provide retry options
       // Log error for debugging
   }
   ```

2. **Use error recovery methods**:
   ```typescript
   await chat.retryFailedQueries?.();
   ```

3. **Monitor error rates**:
   ```typescript
   const metrics = chat.getMetrics?.();
   if (metrics?.queryMetrics.errorRate > 0.1) {
       // High error rate - investigate
   }
   ```

### Real-time Features

1. **Clean up WebSocket connections**:
   - Connections are automatically cleaned up on unmount
   - No manual cleanup required

2. **Handle connection issues gracefully**:
   - WebSocket automatically reconnects
   - Falls back to polling if needed

3. **Optimize message subscriptions**:
   - Only subscribe to relevant chats
   - Use specific patterns for efficiency

---

## Troubleshooting

### Common Issues

#### WebSocket Connection Failed
- Check WebSocket server URL
- Verify network connectivity
- Check firewall settings

#### High Error Rate
- Verify authentication tokens
- Check API endpoints
- Monitor server health

#### Slow Performance
- Check cache strategy
- Monitor network latency
- Review query complexity

#### Memory Issues
- Reset metrics periodically
- Check cache size
- Monitor component unmounting

### Debug Mode

Enable logging in DI container:
```typescript
const container = new ChatDIContainer({
    enableLogging: true
});
```

This provides detailed console logs for all operations.

---

## API Reference

For complete type definitions and interfaces, refer to the TypeScript definitions in:
- `src/features/chat/application/hooks/useUnifiedChat.ts`
- `src/features/chat/application/services/ChatMetricsService.ts`
- `src/features/chat/data/services/WebSocketService.ts`
