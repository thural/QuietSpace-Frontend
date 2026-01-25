# Standardized WebSocket Hooks Guide

## Overview

This guide covers the standardized WebSocket hooks implementation that provides enterprise-grade real-time functionality across all features. The hooks offer a unified API, migration support, and comprehensive monitoring capabilities.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Hooks](#core-hooks)
3. [Feature-Specific Hooks](#feature-specific-hooks)
4. [Migration Utilities](#migration-utilities)
5. [Monitoring & Debugging](#monitoring--debugging)
6. [Usage Examples](#usage-examples)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Architecture Overview

### Hook Hierarchy

```
WebSocket Hooks
├── Core Hooks
│   ├── useFeatureWebSocket (Unified interface)
│   ├── useWebSocketMonitor (Global monitoring)
│   └── useMultipleWebSockets (Multi-feature management)
├── Feature-Specific Hooks
│   ├── useChatWebSocket / useChatWebSocketHook
│   ├── useNotificationWebSocket / useNotificationWebSocketHook
│   └── useFeedWebSocket / useFeedWebSocketHook
├── Migration Utilities
│   ├── useWebSocketMigration (Single feature migration)
│   └── useMultiFeatureMigration (Multi-feature migration)
└── Utilities
    ├── Configuration helpers
    ├── Performance monitoring
    ├── Error handling
    └── Debugging tools
```

### Enterprise Integration

All hooks integrate with the enterprise WebSocket infrastructure:

- **Enterprise WebSocket Service**: Centralized connection management
- **Message Router**: Feature-based message routing and validation
- **Cache Manager**: Real-time cache invalidation and persistence
- **DI Container**: Type-safe dependency injection
- **Performance Monitoring**: Comprehensive metrics and health checks

## Core Hooks

### useFeatureWebSocket

The unified hook that provides a consistent interface across all features.

```typescript
import { useFeatureWebSocket } from '@/core/websocket/hooks';

const chat = useFeatureWebSocket({
  feature: 'chat',
  autoConnect: true,
  enableMetrics: true,
  connectionTimeout: 10000,
  maxReconnectAttempts: 5
});
```

#### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `feature` | `'chat' \| 'notification' \| 'feed'` | Required | Feature to connect to |
| `autoConnect` | `boolean` | `true` | Auto-connect on mount |
| `reconnectOnMount` | `boolean` | `true` | Reconnect when component mounts |
| `enableMetrics` | `boolean` | `true` | Enable performance metrics |
| `connectionTimeout` | `number` | `10000` | Connection timeout in ms |
| `maxReconnectAttempts` | `number` | `5` | Max reconnection attempts |
| `retryDelay` | `number` | `1000` | Retry delay in ms |

#### Return Value

```typescript
interface UseFeatureWebSocketReturn {
  // Connection state
  isConnected: boolean;
  connectionState: WebSocketConnectionState;
  isConnecting: boolean;
  error: string | null;
  lastMessage: WebSocketMessage | null;
  metrics: any;
  adapter: any;

  // Operations
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  reconnect: () => Promise<void>;
  sendMessage: (message: WebSocketMessage) => Promise<void>;
  sendFeatureMessage: (message: any) => Promise<void>;

  // Subscriptions
  subscribe: (callback: (message: WebSocketMessage) => void) => () => void;

  // Utilities
  getMetrics: () => any;
  clearMetrics: () => void;
  reset: () => void;
}
```

### useWebSocketMonitor

Global monitoring hook for WebSocket connections across all features.

```typescript
import { useWebSocketMonitor } from '@/core/websocket/hooks';

const monitor = useWebSocketMonitor();
```

#### Return Value

```typescript
interface WebSocketMonitorReturn {
  totalConnections: number;
  activeConnections: number;
  totalMessages: number;
  errors: number;
  lastActivity: Date | null;
  getGlobalMetrics: () => any;
  refresh: () => void;
}
```

### useMultipleWebSockets

Manage multiple WebSocket connections simultaneously.

```typescript
import { useMultipleWebSockets } from '@/core/websocket/hooks';

const multi = useMultipleWebSockets(['chat', 'notification', 'feed']);
```

#### Return Value

```typescript
interface MultipleWebSocketsReturn {
  connections: Record<string, UseFeatureWebSocketReturn>;
  connectAll: () => Promise<void>;
  disconnectAll: () => Promise<void>;
  getMetrics: () => Record<string, any>;
  isAnyConnected: boolean;
  allConnected: boolean;
}
```

## Feature-Specific Hooks

### Chat Hooks

#### useChatWebSocket

Basic chat WebSocket functionality.

```typescript
import { useChatWebSocket } from '@/core/websocket/hooks';

const chat = useChatWebSocket({
  enablePresence: true,
  enableTypingIndicators: true,
  enableReadReceipts: true,
  maxHistorySize: 100
});
```

#### useChatWebSocketHook

Advanced chat WebSocket functionality with full feature set.

```typescript
import { useChatWebSocketHook } from '@/core/websocket/hooks';

const chat = useChatWebSocketHook({
  enablePresence: true,
  enableTypingIndicators: true,
  enableReadReceipts: true,
  enableMessageHistory: true,
  maxHistorySize: 100,
  presenceUpdateInterval: 30000,
  typingTimeout: 3000
});
```

#### Chat Hook Features

- **Message Management**: Send, receive, and manage chat messages
- **Presence Tracking**: Real-time user presence and online status
- **Typing Indicators**: Real-time typing notifications
- **Read Receipts**: Message read status tracking
- **Chat Management**: Join/leave chat rooms
- **Message History**: Configurable message history storage

### Notification Hooks

#### useNotificationWebSocket

Basic notification WebSocket functionality.

```typescript
import { useNotificationWebSocket } from '@/core/websocket/hooks';

const notifications = useNotificationWebSocket({
  enablePushNotifications: true,
  enableBatchProcessing: true,
  maxNotifications: 100
});
```

#### useNotificationWebSocketHook

Advanced notification WebSocket functionality.

```typescript
import { useNotificationWebSocketHook } from '@/core/websocket/hooks';

const notifications = useNotificationWebSocketHook({
  enablePushNotifications: true,
  enableBatchProcessing: true,
  enablePriorityFiltering: true,
  maxNotifications: 100,
  batchSize: 10,
  batchTimeout: 5000,
  retentionPeriod: 86400000 // 24 hours
});
```

#### Notification Hook Features

- **Real-time Notifications**: Instant notification delivery
- **Push Integration**: Service worker integration
- **Batch Processing**: Efficient batch notification handling
- **Priority Filtering**: Priority-based notification filtering
- **Preference Management**: User notification preferences
- **Retention Management**: Automatic cleanup of old notifications

### Feed Hooks

#### useFeedWebSocket

Basic feed WebSocket functionality.

```typescript
import { useFeedWebSocket } from '@/core/websocket/hooks';

const feed = useFeedWebSocket({
  enableRealtimeUpdates: true,
  enableTrendingUpdates: true,
  maxPosts: 100
});
```

#### useFeedWebSocketHook

Advanced feed WebSocket functionality.

```typescript
import { useFeedWebSocketHook } from '@/core/websocket/hooks';

const feed = useFeedWebSocketHook({
  enableRealtimeUpdates: true,
  enableTrendingUpdates: true,
  enableBatchProcessing: true,
  enablePersonalization: true,
  maxPosts: 100,
  batchSize: 10,
  batchTimeout: 2000,
  trendingRefreshInterval: 30000,
  enableContentFiltering: true
});
```

#### Feed Hook Features

- **Real-time Posts**: Instant post updates and creation
- **Engagement Tracking**: Likes, comments, shares, saves
- **Trending Updates**: Real-time trending post updates
- **Batch Processing**: Efficient batch update handling
- **Content Filtering**: Intelligent content filtering
- **Personalization**: User-specific feed customization

## Migration Utilities

### useWebSocketMigration

Gradual migration utility for transitioning from legacy to enterprise hooks.

```typescript
import { useWebSocketMigration } from '@/core/websocket/hooks';

const migration = useWebSocketMigration({
  feature: 'chat',
  migrationMode: 'hybrid', // 'legacy' | 'hybrid' | 'enterprise'
  enableFallback: true,
  logMigrationEvents: true,
  fallbackTimeout: 5000
});
```

#### Migration Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| `legacy` | Use only legacy implementation | Testing legacy functionality |
| `hybrid` | Try enterprise, fallback to legacy | Gradual migration |
| `enterprise` | Use only enterprise implementation | Full migration |

#### Migration Features

- **Automatic Fallback**: Fallback to legacy if enterprise fails
- **Performance Comparison**: Compare performance between implementations
- **Event Logging**: Detailed migration event tracking
- **Health Monitoring**: Monitor migration health and status

### useMultiFeatureMigration

Manage migration across multiple features simultaneously.

```typescript
import { useMultiFeatureMigration } from '@/core/websocket/hooks';

const multiMigration = useMultiFeatureMigration(['chat', 'notification', 'feed']);
```

## Monitoring & Debugging

### Performance Monitoring

All hooks include built-in performance monitoring:

```typescript
const metrics = hook.getMetrics();
console.log('Connection uptime:', metrics.connectionUptime);
console.log('Message latency:', metrics.averageUpdateLatency);
console.log('Cache hit rate:', metrics.cacheHitRate);
console.log('Error rate:', metrics.errorRate);
```

### Health Checks

Monitor connection health:

```typescript
import { checkConnectionHealth } from '@/core/websocket/hooks';

const health = checkConnectionHealth(hook);
if (!health.healthy) {
  console.warn('Connection issues:', health.issues);
}
```

### Debugging

Enable debugging in development:

```typescript
import { enableWebSocketDebugging } from '@/core/websocket/hooks';

if (process.env.NODE_ENV === 'development') {
  enableWebSocketDebugging();
}
```

### Error Handling

Comprehensive error handling with context:

```typescript
import { handleWebSocketError } from '@/core/websocket/hooks';

try {
  await hook.sendMessage(message);
} catch (error) {
  const handled = handleWebSocketError(error, 'chat-message-send');
  console.log('Error handled:', handled);
}
```

## Usage Examples

### Basic Chat Implementation

```typescript
import React from 'react';
import { useChatWebSocket } from '@/core/websocket/hooks';

const ChatComponent: React.FC = () => {
  const chat = useChatWebSocket({
    enablePresence: true,
    enableTypingIndicators: true
  });

  useEffect(() => {
    // Subscribe to messages
    const unsubscribe = chat.subscribe((message) => {
      console.log('New message:', message);
    });

    return unsubscribe;
  }, [chat]);

  const sendMessage = async (content: string) => {
    try {
      await chat.sendMessage('chat-room-1', content);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div>
      <div className="status">
        Status: {chat.isConnected ? 'Connected' : 'Disconnected'}
        {chat.isConnecting && ' (Connecting...)'}
        {chat.error && ` Error: ${chat.error}`}
      </div>
      
      <div className="messages">
        {chat.messages.map((message, index) => (
          <div key={index}>{message.content}</div>
        ))}
      </div>
      
      <input
        type="text"
        placeholder="Type a message..."
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            sendMessage(e.currentTarget.value);
            e.currentTarget.value = '';
          }
        }}
      />
    </div>
  );
};
```

### Advanced Feed Implementation

```typescript
import React from 'react';
import { useFeedWebSocketHook } from '@/core/websocket/hooks';

const FeedComponent: React.FC = () => {
  const feed = useFeedWebSocketHook({
    enableTrendingUpdates: true,
    enableBatchProcessing: true,
    maxPosts: 50
  });

  useEffect(() => {
    // Subscribe to new posts
    const unsubscribePosts = feed.subscribeToPosts((post) => {
      console.log('New post:', post);
    });

    // Subscribe to trending updates
    const unsubscribeTrending = feed.subscribeToTrending((trendingPosts) => {
      console.log('Trending updated:', trendingPosts);
    });

    return () => {
      unsubscribePosts();
      unsubscribeTrending();
    };
  }, [feed]);

  const createPost = async (content: string) => {
    try {
      await feed.createPost(content);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const addReaction = async (postId: string, reactionType: string) => {
    try {
      await feed.addReaction(postId, reactionType);
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  return (
    <div>
      <div className="feed-stats">
        <p>Posts: {feed.posts.length}</p>
        <p>Trending: {feed.trendingPosts.length}</p>
        <p>Updates: {feed.updates.length}</p>
      </div>
      
      <div className="create-post">
        <textarea
          placeholder="What's on your mind?"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              createPost(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
        />
      </div>
      
      <div className="posts">
        {feed.posts.map((post) => (
          <div key={post.id} className="post">
            <p>{post.text}</p>
            <div className="post-actions">
              <button onClick={() => addReaction(post.id, 'like')}>
                ❤️ {post.likeCount || 0}
              </button>
              <button onClick={() => addReaction(post.id, 'comment')}>
                💬 {post.commentCount || 0}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Migration Implementation

```typescript
import React from 'react';
import { useWebSocketMigration } from '@/core/websocket/hooks';

const MigrationExample: React.FC = () => {
  const migration = useWebSocketMigration({
    feature: 'chat',
    migrationMode: 'hybrid',
    enableFallback: true,
    logMigrationEvents: true
  });

  useEffect(() => {
    // Monitor migration events
    const interval = setInterval(() => {
      const report = migration.getMigrationReport();
      console.log('Migration report:', report);
    }, 10000);

    return () => clearInterval(interval);
  }, [migration]);

  const switchMode = (mode: 'legacy' | 'hybrid' | 'enterprise') => {
    switch (mode) {
      case 'legacy':
        migration.switchToLegacy();
        break;
      case 'hybrid':
        migration.switchToHybrid();
        break;
      case 'enterprise':
        migration.switchToEnterprise();
        break;
    }
  };

  return (
    <div>
      <div className="migration-status">
        <p>Current Mode: {migration.state.mode}</p>
        <p>Using Legacy: {migration.state.isUsingLegacy ? 'Yes' : 'No'}</p>
        <p>Using Enterprise: {migration.state.isUsingEnterprise ? 'Yes' : 'No'}</p>
        <p>Fallback Triggered: {migration.state.fallbackTriggered ? 'Yes' : 'No'}</p>
      </div>
      
      <div className="migration-controls">
        <button onClick={() => switchMode('legacy')}>Legacy Mode</button>
        <button onClick={() => switchMode('hybrid')}>Hybrid Mode</button>
        <button onClick={() => switchMode('enterprise')}>Enterprise Mode</button>
      </div>
      
      <div className="migration-events">
        <h4>Recent Events:</h4>
        {migration.state.migrationEvents.slice(0, 5).map((event, index) => (
          <div key={index}>
            {new Date(event.timestamp).toLocaleTimeString()}: {event.message}
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Best Practices

### 1. Connection Management

- **Auto-connect**: Use `autoConnect: true` for most components
- **Cleanup**: Always call `reset()` or `disconnect()` on unmount
- **Error Handling**: Implement proper error boundaries
- **Retry Logic**: Let hooks handle reconnection automatically

### 2. Performance Optimization

- **Metrics**: Enable metrics in production for monitoring
- **Batching**: Use batch processing for high-volume features
- **Caching**: Leverage built-in caching strategies
- **Subscriptions**: Clean up subscriptions to prevent memory leaks

### 3. Migration Strategy

- **Gradual Migration**: Start with hybrid mode for testing
- **Feature Flags**: Use feature flags for controlled rollout
- **Monitoring**: Monitor migration performance and errors
- **Fallback**: Keep fallback enabled during transition

### 4. Error Handling

- **Boundaries**: Implement error boundaries around hook usage
- **Logging**: Use built-in error logging and monitoring
- **Recovery**: Leverage automatic reconnection and fallback
- **User Feedback**: Provide user-friendly error messages

### 5. Testing

- **Mocking**: Use mock implementations for unit tests
- **Integration**: Test with real WebSocket connections
- **Performance**: Test performance under load
- **Migration**: Test migration scenarios thoroughly

## Troubleshooting

### Common Issues

#### Connection Issues

**Problem**: WebSocket connection fails
**Solution**: 
- Check network connectivity
- Verify WebSocket server status
- Check authentication tokens
- Review firewall settings

```typescript
// Debug connection issues
const health = checkConnectionHealth(hook);
if (!health.healthy) {
  console.error('Connection issues:', health.issues);
}
```

#### Performance Issues

**Problem**: High latency or slow updates
**Solution**:
- Check metrics for bottlenecks
- Verify cache hit rates
- Monitor network requests
- Optimize message batching

```typescript
// Monitor performance
const metrics = hook.getMetrics();
if (metrics.averageUpdateLatency > 1000) {
  console.warn('High latency detected:', metrics);
}
```

#### Migration Issues

**Problem**: Fallback triggered frequently
**Solution**:
- Check enterprise implementation stability
- Verify network conditions
- Monitor error rates
- Adjust timeout settings

```typescript
// Monitor migration health
const report = migration.getMigrationReport();
if (report.fallbackCount > 5) {
  console.warn('High fallback count:', report.issues);
}
```

### Debug Mode

Enable comprehensive debugging in development:

```typescript
import { enableWebSocketDebugging } from '@/core/websocket/hooks';

// Enable debugging
enableWebSocketDebugging();

// Monitor all events
const monitor = useWebSocketMonitor();
setInterval(() => {
  console.log('Global metrics:', monitor.getGlobalMetrics());
}, 5000);
```

### Performance Monitoring

Regular monitoring in production:

```typescript
// Set up performance monitoring
const monitor = useWebSocketMonitor();

// Alert on issues
useEffect(() => {
  if (monitor.errors > 10) {
    // Send alert to monitoring service
    alertService.send('WebSocket error threshold exceeded');
  }
}, [monitor.errors]);
```

## API Reference

### Default Configurations

```typescript
// Default WebSocket configuration
export const DEFAULT_WEBSOCKET_CONFIG = {
  autoConnect: true,
  reconnectOnMount: true,
  enableMetrics: true,
  connectionTimeout: 10000,
  maxReconnectAttempts: 5,
  retryDelay: 1000
};

// Default chat configuration
export const DEFAULT_CHAT_CONFIG = {
  autoConnect: true,
  enablePresence: true,
  enableTypingIndicators: true,
  enableReadReceipts: true,
  enableMessageHistory: true,
  maxHistorySize: 100,
  presenceUpdateInterval: 30000,
  typingTimeout: 3000
};

// Default notification configuration
export const DEFAULT_NOTIFICATION_CONFIG = {
  autoConnect: true,
  enablePushNotifications: true,
  enableBatchProcessing: true,
  enablePriorityFiltering: true,
  maxNotifications: 100,
  batchSize: 10,
  batchTimeout: 5000,
  retentionPeriod: 86400000 // 24 hours
};

// Default feed configuration
export const DEFAULT_FEED_CONFIG = {
  autoConnect: true,
  enableRealtimeUpdates: true,
  enableTrendingUpdates: true,
  enableBatchProcessing: true,
  enablePersonalization: true,
  maxPosts: 100,
  batchSize: 10,
  batchTimeout: 2000,
  trendingRefreshInterval: 30000,
  enableContentFiltering: true
};
```

### Utility Functions

```typescript
// Create configuration with overrides
createWebSocketConfig(DEFAULT_CHAT_CONFIG, { autoConnect: false });

// Validate configuration
validateWebSocketConfig({ feature: 'chat' }); // returns boolean

// Get feature-specific hook
getFeatureHook('chat'); // returns useChatWebSocket

// Get advanced feature hook
getAdvancedFeatureHook('chat'); // returns useChatWebSocketHook

// Performance measurement
measureWebSocketPerformance(hook);

// Migration strategy creation
createMigrationStrategy(['chat', 'notification'], 'gradual');

// Error handling
handleWebSocketError(error, 'context');

// Health checking
checkConnectionHealth(hook);

// Debugging
enableWebSocketDebugging();

// Mock hook for testing
createMockWebSocketHook('chat');
```

## Conclusion

The standardized WebSocket hooks provide a comprehensive, enterprise-grade solution for real-time functionality across all features. With proper configuration, monitoring, and migration support, they enable scalable and maintainable WebSocket implementations.

For more examples and advanced usage, see the `WebSocketHooksExample` component in the codebase.
