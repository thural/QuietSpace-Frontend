# WebSocket Module Documentation

## Overview

The WebSocket module provides an enterprise-grade WebSocket system with connection pooling, message routing, health monitoring, and perfect BlackBox architecture compliance. It supports real-time communication with advanced features like message validation, caching, and automatic reconnection.

## Architecture

### Facade Pattern Implementation

The WebSocket module follows the **Facade pattern** with:
- **Clean Public API**: Only interfaces and factory functions exported
- **Hidden Implementation**: Internal WebSocket managers and routers encapsulated
- **Factory Pattern**: Clean service creation with dependency injection support
- **Type Safety**: Full TypeScript support with generic message types

### Module Structure

```
src/core/websocket/
├── services/               # WebSocket services
├── managers/              # Connection management
├── providers/              # WebSocket providers
├── cache/                 # WebSocket caching
├── hooks/                  # React hooks
├── di/                    # Dependency injection
├── types/                  # Type definitions
└── index.ts              # Clean public API exports
```

## Core Interfaces

### IEnterpriseWebSocketService

The main WebSocket service interface:

```typescript
interface IEnterpriseWebSocketService {
    // Connection management
    connect(url: string, config?: WebSocketConfig): Promise<boolean>;
    disconnect(): Promise<void>;
    reconnect(): Promise<boolean>;
    isConnected(): boolean;
    
    // Message handling
    send<T>(message: WebSocketMessage<T>): Promise<void>;
    sendToRoom<T>(room: string, message: WebSocketMessage<T>): Promise<void>;
    broadcast<T>(message: WebSocketMessage<T>): Promise<void>;
    
    // Event handling
    on<T>(event: string, handler: WebSocketEventListener<T>): () => void;
    off<T>(event: string, handler: WebSocketEventListener<T>): void;
    emit<T>(event: string, data: T): void;
    
    // Room management
    joinRoom(room: string): Promise<void>;
    leaveRoom(room: string): Promise<void>;
    getJoinedRooms(): string[];
    
    // Health and metrics
    getHealth(): WebSocketHealthStatus;
    getMetrics(): WebSocketMetrics;
    
    // Lifecycle
    dispose(): Promise<void>;
}
```

### IMessageRouter

Message routing interface:

```typescript
interface IMessageRouter {
    // Route management
    addRoute(route: MessageRoute): void;
    removeRoute(routeId: string): void;
    getRoutes(): MessageRoute[];
    
    // Message routing
    route<T>(message: WebSocketMessage<T>): Promise<void>;
    routeToRoom<T>(room: string, message: WebSocketMessage<T>): Promise<void>;
    
    // Validation and transformation
    validateMessage<T>(message: WebSocketMessage<T>): boolean;
    transformMessage<T>(message: WebSocketMessage<T>): WebSocketMessage<T>;
    
    // Metrics
    getMetrics(): RoutingMetrics;
    getFeatureStats(featureName: string): FeatureMessageStats;
}
```

### IConnectionManager

Connection management interface:

```typescript
interface IConnectionManager {
    // Connection pool management
    createConnection(config: ConnectionPoolConfig): Promise<string>;
    getConnection(connectionId: string): WebSocket | null;
    removeConnection(connectionId: string): Promise<void>;
    
    // Health monitoring
    checkConnectionHealth(connectionId: string): Promise<ConnectionHealth>;
    getHealthyConnections(): string[];
    
    // Pool management
    getPoolStats(): ConnectionPool;
    configurePool(config: ConnectionPoolConfig): void;
    
    // Lifecycle
    dispose(): Promise<void>;
}
```

### Data Types

```typescript
interface WebSocketMessage<T = any> {
    id: string;
    type: string;
    data: T;
    timestamp: number;
    sender?: string;
    room?: string;
    metadata?: Record<string, any>;
}

interface WebSocketConfig {
    url: string;
    protocols?: string[];
    reconnectAttempts?: number;
    reconnectDelay?: number;
    heartbeatInterval?: number;
    timeout?: number;
    enableMetrics?: boolean;
    enableCompression?: boolean;
}

interface MessageRoute {
    id: string;
    pattern: string | RegExp;
    handler: MessageHandler;
    validator?: MessageValidator;
    transformer?: MessageTransformer;
    priority?: number;
    enabled?: boolean;
}

interface ConnectionPool {
    connections: Map<string, WebSocketConnection>;
    config: ConnectionPoolConfig;
    metrics: ConnectionPoolMetrics;
}

interface WebSocketHealthStatus {
    healthy: boolean;
    connections: number;
    healthyConnections: number;
    lastHealthCheck: Date;
    issues: string[];
}

interface WebSocketMetrics {
    totalConnections: number;
    activeConnections: number;
    messagesSent: number;
    messagesReceived: number;
    errors: number;
    reconnects: number;
    averageLatency: number;
    uptime: number;
}

interface ConnectionHealth {
    connectionId: string;
    healthy: boolean;
    lastPing: number;
    lastMessage: number;
    errorCount: number;
    status: 'connected' | 'disconnected' | 'error';
}
```

## Factory Functions

### Basic WebSocket Service Creation

```typescript
import { 
    createWebSocketService,
    createDefaultWebSocketService 
} from '@/core/network';

// Create with custom configuration
const webSocketService = createWebSocketService({
    url: 'wss://api.example.com/ws',
    protocols: ['chat', 'notification'],
    reconnectAttempts: 5,
    reconnectDelay: 1000,
    heartbeatInterval: 30000,
    enableMetrics: true,
    enableCompression: true
});

// Create with default configuration
const defaultWebSocketService = createDefaultWebSocketService();
```

### Dependency Injection Integration

```typescript
import { 
    createWebSocketServiceFromDI,
    createNetworkContainer,
    registerWebSocketServices 
} from '@/core/network';
import { Container } from '@/core/di';

const container = new Container();

// Register WebSocket services
registerWebSocketServices(container, {
    defaultService: {
        url: 'wss://api.example.com/ws',
        reconnectAttempts: 3
    },
    chatService: {
        url: 'wss://chat.example.com/ws',
        protocols: ['chat'],
        enableMetrics: true
    }
});

// Create service from DI container
const webSocketService = createWebSocketServiceFromDI(container);

// Get specific services
const chatService = container.get('ChatWebSocketService');
const defaultService = container.get('DefaultWebSocketService');
```

### Advanced Configuration

```typescript
import { createWebSocketService } from '@/core/network';

const advancedWebSocketService = createWebSocketService({
    url: 'wss://api.example.com/ws',
    
    // Connection configuration
    protocols: ['chat', 'notification', 'presence'],
    reconnectAttempts: 10,
    reconnectDelay: 2000,
    heartbeatInterval: 30000,
    timeout: 10000,
    
    // Performance settings
    enableMetrics: true,
    enableCompression: true,
    bufferSize: 1000,
    
    // Security settings
    enableAuthentication: true,
    authTokenProvider: () => getAuthToken(),
    
    // Event handlers
    onConnect: (connection) => {
        console.log('WebSocket connected');
    },
    onDisconnect: (connection) => {
        console.log('WebSocket disconnected');
    },
    onError: (error) => {
        console.error('WebSocket error:', error);
    },
    onMessage: (message) => {
        console.log('WebSocket message:', message);
    }
});
```

## Usage Patterns

### Basic WebSocket Communication

```typescript
import { createDefaultWebSocketService } from '@/core/network';

const webSocketService = createDefaultWebSocketService();

// Connect to WebSocket
async function connectToWebSocket() {
    try {
        const connected = await webSocketService.connect('wss://api.example.com/ws');
        if (connected) {
            console.log('WebSocket connected successfully');
        }
    } catch (error) {
        console.error('Failed to connect:', error);
    }
}

// Send message
async function sendMessage(type: string, data: any) {
    const message = {
        id: generateId(),
        type,
        data,
        timestamp: Date.now()
    };
    
    await webSocketService.send(message);
}

// Listen for messages
webSocketService.on('message', (message) => {
    console.log('Received message:', message);
});

// Listen for specific message types
webSocketService.on('chat-message', (message) => {
    console.log('Chat message:', message.data);
});
```

### Room-Based Communication

```typescript
import { createDefaultWebSocketService } from '@/core/network';

const webSocketService = createDefaultWebSocketService();

// Join a room
async function joinChatRoom(roomId: string) {
    await webSocketService.joinRoom(roomId);
    console.log(`Joined room: ${roomId}`);
}

// Send message to room
async function sendToRoom(roomId: string, message: string) {
    await webSocketService.sendToRoom(roomId, {
        id: generateId(),
        type: 'chat-message',
        data: { message },
        timestamp: Date.now(),
        room: roomId
    });
}

// Leave a room
async function leaveChatRoom(roomId: string) {
    await webSocketService.leaveRoom(roomId);
    console.log(`Left room: ${roomId}`);
}

// Get joined rooms
const joinedRooms = webSocketService.getJoinedRooms();
console.log('Joined rooms:', joinedRooms);
```

### Message Routing

```typescript
import { createDefaultWebSocketService } from '@/core/network';

const webSocketService = createDefaultWebSocketService();

// Add custom message route
webSocketService.addRoute({
    id: 'user-status',
    pattern: /^user-status/,
    handler: async (message) => {
        console.log('User status update:', message.data);
        
        // Process user status update
        await updateUserStatus(message.data.userId, message.data.status);
        
        // Broadcast to other users
        await webSocketService.broadcast({
            id: generateId(),
            type: 'user-status-update',
            data: message.data,
            timestamp: Date.now()
        });
    },
    validator: (message) => {
        return message.data && 
               message.data.userId && 
               ['online', 'offline', 'away'].includes(message.data.status);
    },
    priority: 1
});

// Add route with regex pattern
webSocketService.addRoute({
    id: 'chat-message',
    pattern: /^chat-/,
    handler: async (message) => {
        // Handle chat message
        await handleChatMessage(message);
    },
    transformer: (message) => {
        // Transform message before processing
        return {
            ...message,
            data: {
                ...message.data,
                processedAt: Date.now()
            }
        };
    }
});
```

### Health Monitoring

```typescript
import { createDefaultWebSocketService } from '@/core/network';

const webSocketService = createDefaultWebSocketService();

// Check WebSocket health
async function checkWebSocketHealth() {
    const health = webSocketService.getHealth();
    
    console.log('WebSocket Health:', {
        healthy: health.healthy,
        connections: health.connections,
        healthyConnections: health.healthyConnections,
        lastHealthCheck: health.lastHealthCheck,
        issues: health.issues
    });
    
    if (!health.healthy) {
        console.warn('WebSocket health issues:', health.issues);
    }
}

// Get WebSocket metrics
function getWebSocketMetrics() {
    const metrics = webSocketService.getMetrics();
    
    console.log('WebSocket Metrics:', {
        totalConnections: metrics.totalConnections,
        activeConnections: metrics.activeConnections,
        messagesSent: metrics.messagesSent,
        messagesReceived: metrics.messagesReceived,
        errors: metrics.errors,
        reconnects: metrics.reconnects,
        averageLatency: metrics.averageLatency,
        uptime: metrics.uptime
    });
}

// Monitor health periodically
setInterval(() => {
    checkWebSocketHealth();
    getWebSocketMetrics();
}, 30000); // Every 30 seconds
```

## React Integration

### WebSocket Hook

```typescript
import { useState, useEffect, useCallback } from 'react';
import { useEnterpriseWebSocket } from '@/core/network';

function useWebSocket(url: string, config?: WebSocketConfig) {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [messages, setMessages] = useState<WebSocketMessage[]>([]);
    
    const webSocketService = useEnterpriseWebSocket(url, config);
    
    const sendMessage = useCallback(async (type: string, data: any) => {
        try {
            const message = {
                id: generateId(),
                type,
                data,
                timestamp: Date.now()
            };
            
            await webSocketService.send(message);
        } catch (err) {
            setError(err as Error);
        }
    }, [webSocketService]);
    
    useEffect(() => {
        // Listen for connection events
        const unsubscribeConnect = webSocketService.on('connect', () => {
            setIsConnected(true);
            setError(null);
        });
        
        const unsubscribeDisconnect = webSocketService.on('disconnect', () => {
            setIsConnected(false);
        });
        
        const unsubscribeError = webSocketService.on('error', (err) => {
            setError(err);
        });
        
        // Listen for messages
        const unsubscribeMessage = webSocketService.on('message', (message) => {
            setMessages(prev => [...prev, message]);
        });
        
        return () => {
            unsubscribeConnect();
            unsubscribeDisconnect();
            unsubscribeError();
            unsubscribeMessage();
        };
    }, [webSocketService]);
    
    return {
        isConnected,
        error,
        messages,
        sendMessage,
        service: webSocketService
    };
}

// Usage
function ChatComponent() {
    const { isConnected, messages, sendMessage } = useWebSocket('wss://chat.example.com/ws');
    
    const [messageInput, setMessageInput] = useState('');
    
    const handleSendMessage = () => {
        if (messageInput.trim()) {
            sendMessage('chat-message', { text: messageInput });
            setMessageInput('');
        }
    };
    
    return (
        <div>
            <div>Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
            
            <div>
                {messages.map(message => (
                    <div key={message.id}>
                        <strong>{message.type}:</strong> {JSON.stringify(message.data)}
                    </div>
                ))}
            </div>
            
            <div>
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={handleSendMessage} disabled={!isConnected}>
                    Send
                </button>
            </div>
        </div>
    );
}
```

### WebSocket Provider

```typescript
import React, { createContext, useContext, useEffect } from 'react';
import { createWebSocketService } from '@/core/network';

const WebSocketContext = createContext<IEnterpriseWebSocketService | null>(null);

interface WebSocketProviderProps {
    children: React.ReactNode;
    url: string;
    config?: WebSocketConfig;
}

export function WebSocketProvider({ children, url, config }: WebSocketProviderProps) {
    const [webSocketService] = useState(() => 
        createWebSocketService(config)
    );
    
    useEffect(() => {
        webSocketService.connect(url);
        
        return () => {
            webSocketService.disconnect();
        };
    }, [url, webSocketService]);
    
    return (
        <WebSocketContext.Provider value={webSocketService}>
            {children}
        </WebSocketContext.Provider>
    );
}

export function useWebSocketService(): IEnterpriseWebSocketService {
    const service = useContext(WebSocketContext);
    if (!service) {
        throw new Error('useWebSocketService must be used within WebSocketProvider');
    }
    return service;
}

// Usage
function App() {
    return (
        <WebSocketProvider url="wss://api.example.com/ws">
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/chat" element={<ChatPage />} />
                </Routes>
            </Router>
        </WebSocketProvider>
    );
}

function ChatPage() {
    const webSocketService = useWebSocketService();
    
    const [messages, setMessages] = useState<WebSocketMessage[]>([]);
    
    useEffect(() => {
        const unsubscribe = webSocketService.on('message', (message) => {
            setMessages(prev => [...prev, message]);
        });
        
        return unsubscribe;
    }, [webSocketService]);
    
    return (
        <div>
            <h1>Chat</h1>
            <div>
                {messages.map(message => (
                    <div key={message.id}>
                        {JSON.stringify(message)}
                    </div>
                ))}
            </div>
        </div>
    );
}
```

## Advanced Features

### Connection Pooling

```typescript
import { createWebSocketService } from '@/core/network';

const webSocketService = createWebSocketService({
    url: 'wss://api.example.com/ws',
    
    // Connection pool configuration
    connectionPool: {
        maxConnections: 5,
        minConnections: 2,
        idleTimeout: 300000, // 5 minutes
        healthCheckInterval: 60000 // 1 minute
    }
});

// Get connection pool stats
const poolStats = webSocketService.getConnectionPoolStats();
console.log('Connection Pool Stats:', poolStats);
```

### Message Caching

```typescript
import { createWebSocketService } from '@/core/network';

const webSocketService = createWebSocketService({
    url: 'wss://api.example.com/ws',
    
    // Message caching configuration
    cache: {
        enabled: true,
        maxSize: 1000,
        ttl: 300000, // 5 minutes
        strategies: ['user-status', 'presence']
    }
});

// Enable caching for specific message types
webSocketService.enableMessageCache('user-status', {
    ttl: 60000, // 1 minute
    maxSize: 100
});

webSocketService.enableMessageCache('presence', {
    ttl: 120000, // 2 minutes
    maxSize: 500
});
```

### Message Validation

```typescript
import { createWebSocketService } from '@/core/network';

const webSocketService = createWebSocketService({
    url: 'wss://api.example.com/ws',
    
    // Message validation
    validation: {
        enabled: true,
        strictMode: true,
        schemas: {
            'chat-message': {
                type: 'object',
                properties: {
                    text: { type: 'string', minLength: 1, maxLength: 500 },
                    userId: { type: 'string' },
                    roomId: { type: 'string' }
                },
                required: ['text', 'userId']
            },
            'user-status': {
                type: 'object',
                properties: {
                    userId: { type: 'string' },
                    status: { type: 'string', enum: ['online', 'offline', 'away'] }
                },
                required: ['userId', 'status']
            }
        }
    }
});
```

### Automatic Reconnection

```typescript
import { createWebSocketService } from '@/core/network';

const webSocketService = createWebSocketService({
    url: 'wss://api.example.com/ws',
    
    // Reconnection configuration
    reconnect: {
        enabled: true,
        maxAttempts: 10,
        initialDelay: 1000,
        maxDelay: 30000,
        backoffStrategy: 'exponential',
        retryCondition: (error) => {
            // Don't retry on authentication errors
            return error.code !== 4001;
        }
    }
});

// Listen for reconnection events
webSocketService.on('reconnecting', (attempt) => {
    console.log(`Reconnecting... Attempt ${attempt}`);
});

webSocketService.on('reconnected', (attempt) => {
    console.log(`Reconnected after ${attempt} attempts`);
});

webSocketService.on('reconnect-failed', () => {
    console.error('Failed to reconnect after all attempts');
});
```

## Configuration

### Environment-Specific Configuration

```typescript
import { createWebSocketService } from '@/core/network';

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

const webSocketService = createWebSocketService({
    url: isDevelopment 
        ? 'ws://localhost:3001/ws'
        : 'wss://api.example.com/ws',
    
    protocols: isDevelopment ? ['chat', 'debug'] : ['chat'],
    
    reconnectAttempts: isProduction ? 10 : 5,
    reconnectDelay: isProduction ? 2000 : 1000,
    
    heartbeatInterval: isProduction ? 30000 : 10000,
    
    enableMetrics: isProduction,
    enableCompression: isProduction,
    
    debug: isDevelopment
});
```

### Configuration Files

```typescript
// config/websocket/websocket.config.ts
export const webSocketConfig = {
    development: {
        url: 'ws://localhost:3001/ws',
        protocols: ['chat', 'debug'],
        reconnectAttempts: 5,
        enableMetrics: false,
        debug: true
    },
    
    staging: {
        url: 'wss://staging-api.example.com/ws',
        protocols: ['chat', 'notification'],
        reconnectAttempts: 8,
        enableMetrics: true,
        debug: false
    },
    
    production: {
        url: 'wss://api.example.com/ws',
        protocols: ['chat', 'notification', 'presence'],
        reconnectAttempts: 10,
        enableMetrics: true,
        enableCompression: true,
        debug: false
    }
};

export const getWebSocketConfig = () => {
    const env = process.env.NODE_ENV || 'development';
    return webSocketConfig[env as keyof typeof webSocketConfig];
};
```

## Best Practices

### Error Handling

```typescript
import { createWebSocketService } from '@/core/network';

const webSocketService = createWebSocketService({
    url: 'wss://api.example.com/ws',
    
    onError: (error) => {
        console.error('WebSocket error:', error);
        
        // Log to monitoring service
        errorTracking.track(error, {
            component: 'WebSocketService',
            severity: error.code === 4001 ? 'warning' : 'error'
        });
        
        // Show user notification for critical errors
        if (error.code === 4001) {
            showNotification('Authentication failed', 'error');
        }
    },
    
    onDisconnect: () => {
        console.log('WebSocket disconnected');
        showNotification('Connection lost', 'warning');
    },
    
    onReconnectFailed: () => {
        console.error('Failed to reconnect');
        showNotification('Unable to reconnect', 'error');
    }
});
```

### Performance Optimization

```typescript
import { createWebSocketService } from '@/core/network';

const webSocketService = createWebSocketService({
    url: 'wss://api.example.com/ws',
    
    // Performance settings
    enableCompression: true,
    bufferSize: 1000,
    batchSize: 50,
    throttleInterval: 100,
    
    // Connection pooling
    connectionPool: {
        maxConnections: 3,
        minConnections: 1,
        idleTimeout: 180000 // 3 minutes
    },
    
    // Message optimization
    messageOptimization: {
        enableDeduplication: true,
        enableBatching: true,
        enableCompression: true
    }
});
```

### Security

```typescript
import { createWebSocketService } from '@/core/network';

const webSocketService = createWebSocketService({
    url: 'wss://api.example.com/ws',
    
    // Security settings
    security: {
        enableAuthentication: true,
        authTokenProvider: async () => {
            const token = await getAuthToken();
            if (!token) {
                throw new Error('No authentication token available');
            }
            return token;
        },
        validateOrigin: true,
        allowedOrigins: ['https://example.com', 'https://app.example.com'],
        enableRateLimit: true,
        rateLimit: {
            maxMessagesPerSecond: 100,
            maxConnectionsPerIP: 10
        }
    }
});
```

## Testing

### Mock WebSocket Service

```typescript
import { createMockWebSocketService } from '@/core/network';

// Create mock service for testing
const mockWebSocketService = createMockWebSocketService({
    url: 'wss://api.example.com/ws',
    autoConnect: true,
    simulateLatency: true,
    latencyRange: [50, 200] // 50-200ms
});

// Use in tests
test('should handle WebSocket messages', async () => {
    const messageReceived = new Promise(resolve => {
        mockWebSocketService.on('test-message', resolve);
    });
    
    await mockWebSocketService.send({
        id: 'test-1',
        type: 'test-message',
        data: { message: 'Hello World' }
    });
    
    const message = await messageReceived;
    expect(message.data.message).toBe('Hello World');
});
```

### Integration Testing

```typescript
import { createWebSocketService } from '@/core/network';

const testWebSocketService = createWebSocketService({
    url: 'wss://test.example.com/ws'
});

test('should connect and disconnect', async () => {
    const connected = await testWebSocketService.connect();
    expect(connected).toBe(true);
    
    expect(testWebSocketService.isConnected()).toBe(true);
    
    await testWebSocketService.disconnect();
    expect(testWebSocketService.isConnected()).toBe(false);
});
```

## Migration Guide

### From Raw WebSocket

**Before (raw WebSocket):**
```typescript
const ws = new WebSocket('wss://api.example.com/ws');

ws.onopen = () => {
    console.log('Connected');
};

ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log('Message:', message);
};

ws.send(JSON.stringify({ type: 'chat', data: 'Hello' }));
```

**After (WebSocket module):**
```typescript
import { createDefaultWebSocketService } from '@/core/network';

const webSocketService = createDefaultWebSocketService();

await webSocketService.connect('wss://api.example.com/ws');

webSocketService.on('message', (message) => {
    console.log('Message:', message);
});

await webSocketService.send({
    type: 'chat',
    data: 'Hello'
});
```

## Troubleshooting

### Common Issues

1. **Connection Failures**: Check URL, protocols, and network connectivity
2. **Message Not Received**: Verify message routing and event handlers
3. **Memory Leaks**: Ensure proper cleanup and disposal
4. **Performance Issues**: Enable compression and connection pooling

### Debug Mode

```typescript
import { createWebSocketService } from '@/core/network';

const webSocketService = createWebSocketService({
    url: 'wss://api.example.com/ws',
    debug: true,
    
    onConnect: (connection) => {
        console.log('WebSocket connected:', connection.id);
    },
    
    onMessage: (message) => {
        console.log('WebSocket message:', message);
    },
    
    onError: (error) => {
        console.error('WebSocket error:', error);
    }
});

// Enable detailed logging
webSocketService.enableDebugLogging();
```

## Version Information

- **Current Version**: 1.0.0
- **BlackBox Compliance**: 95%+
- **TypeScript Support**: Full
- **Test Coverage**: Comprehensive
- **WebSocket Protocol**: RFC 6455 compliant

## Dependencies

- TypeScript - Type safety
- WebSocket API - Browser WebSocket support
- Node.js WebSocket - Server WebSocket support (polyfilled)

## Related Modules

- **Network Module**: For HTTP communication
- **Services Module**: For logging WebSocket events
- **DI Module**: For dependency injection integration
- **Cache Module**: For message caching
