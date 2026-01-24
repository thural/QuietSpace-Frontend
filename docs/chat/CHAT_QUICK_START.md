# Chat Feature Quick Start Guide

## Getting Started

This guide will help you quickly integrate the Chat feature into your React application with enterprise-grade functionality.

## Prerequisites

- React 18+ with TypeScript
- Modern build system (Vite, Webpack, etc.)
- Authentication system with JWT tokens

## Installation

The Chat feature is already part of your codebase. No additional installation needed.

## Basic Usage

### 1. Import the Hook

```typescript
import { useUnifiedChat } from '@/features/chat/application/hooks/useUnifiedChat';
```

### 2. Basic Chat Component

```typescript
import React from 'react';
import { useUnifiedChat } from '@/features/chat/application/hooks/useUnifiedChat';

function ChatComponent({ userId, chatId }) {
    const chat = useUnifiedChat(userId, chatId);

    if (chat.isLoading) return <div>Loading chat...</div>;
    if (chat.error) return <div>Error: {chat.error.message}</div>;

    return (
        <div>
            <h2>Chat</h2>
            
            {/* Messages */}
            <div className=\"messages\">
                {chat.messages?.pages?.map(page => 
                    page.content?.map(msg => (
                        <div key={msg.id} className=\"message\">
                            <strong>{msg.senderName}:</strong> {msg.text}
                        </div>
                    ))
                )}
            </div>

            {/* Send Message */}
            <div className=\"message-input\">
                <input 
                    type=\"text\" 
                    placeholder=\"Type a message...\"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            chat.sendMessage({
                                chatId,
                                messageData: { content: e.target.value }
                            });
                            e.target.value = '';
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default ChatComponent;
```

### 3. Chat List Component

```typescript
import React from 'react';
import { useUnifiedChat } from '@/features/chat/application/hooks/useUnifiedChat';

function ChatList({ userId }) {
    const chat = useUnifiedChat(userId);

    if (chat.isLoading) return <div>Loading chats...</div>;

    return (
        <div>
            <h2>Your Chats</h2>
            <div className=\"chat-list\">
                {chat.chats?.content?.map(chat => (
                    <div key={chat.id} className=\"chat-item\">
                        <h3>{chat.name || 'Untitled Chat'}</h3>
                        <p>{chat.recentMessage?.text}</p>
                        <span>{chat.unreadCount} unread</span>
                    </div>
                ))}
            </div>

            {/* Create New Chat */}
            <button onClick={() => chat.createChat({
                userIds: [userId, 'other-user-id'],
                text: 'Start conversation'
            })}>
                New Chat
            </button>
        </div>
    );
}

export default ChatList;
```

## Advanced Features

### Real-time Chat

Enable real-time updates for live messaging:

```typescript
const chat = useUnifiedChat(userId, chatId, {
    enableRealTime: true
});
```

### Performance Monitoring

Monitor chat performance:

```typescript
function ChatWithMonitoring({ userId, chatId }) {
    const chat = useUnifiedChat(userId, chatId);
    const metrics = chat.getMetrics?.();
    const summary = chat.getPerformanceSummary?.();

    return (
        <div>
            {/* Chat UI */}
            
            {/* Performance Indicator */}
            <div className=\"performance-indicator\">
                <span>Performance: {summary?.overall}</span>
                {summary?.issues.length > 0 && (
                    <span style={{ color: 'orange' }}>
                        ⚠️ {summary.issues.length} issues
                    </span>
                )}
            </div>
        </div>
    );
}
```

### Error Handling

Handle errors gracefully:

```typescript
function RobustChat({ userId, chatId }) {
    const chat = useUnifiedChat(userId, chatId);

    const handleRetry = async () => {
        await chat.retryFailedQueries?.();
    };

    if (chat.error) {
        return (
            <div className=\"error-container\">
                <h3>Something went wrong</h3>
                <p>{chat.error.message}</p>
                <button onClick={handleRetry}>Retry</button>
                
                {/* Show detailed errors */}
                {chat.getErrorSummary?.().map((err, index) => (
                    <div key={index} className=\"error-detail\">
                        {err.type}: {err.error}
                    </div>
                ))}
            </div>
        );
    }

    return <ChatUI chat={chat} />;
}
```

### Optimistic Updates

Enable instant UI updates:

```typescript
const chat = useUnifiedChat(userId, chatId, {
    enableOptimisticUpdates: true
});
```

## Configuration Options

### Cache Strategies

```typescript
// Aggressive caching (longer cache times)
const chat = useUnifiedChat(userId, chatId, {
    cacheStrategy: 'aggressive'
});

// Conservative caching (shorter cache times)
const chat = useUnifiedChat(userId, chatId, {
    cacheStrategy: 'conservative'
});

// Moderate caching (balanced)
const chat = useUnifiedChat(userId, chatId, {
    cacheStrategy: 'moderate'
});
```

### Custom Refresh Intervals

```typescript
const chat = useUnifiedChat(userId, chatId, {
    refetchInterval: {
        chats: 60000,        // Refresh chats every minute
        messages: 30000,    // Refresh messages every 30 seconds
        participants: 120000, // Refresh participants every 2 minutes
        unreadCount: 15000  // Refresh unread count every 15 seconds
    }
});
```

## Common Patterns

### Multi-Chat Application

```typescript
function MultiChatApp({ userId }) {
    // Main chat list
    const mainChat = useUnifiedChat(userId);
    
    // Active chat
    const [activeChatId, setActiveChatId] = useState(null);
    const activeChat = useUnifiedChat(userId, activeChatId, {
        enableRealTime: true,
        enableOptimisticUpdates: true
    });

    return (
        <div className=\"chat-app\">
            <div className=\"chat-sidebar\">
                <ChatList chats={mainChat.chats} onSelect={setActiveChatId} />
            </div>
            <div className=\"chat-main\">
                {activeChatId ? (
                    <ChatWindow chat={activeChat} />
                ) : (
                    <div>Select a chat to start messaging</div>
                )}
            </div>
        </div>
    );
}
```

### Search Functionality

```typescript
function ChatSearch({ userId }) {
    const chat = useUnifiedChat(userId);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = async () => {
        const results = await chat.searchChats(searchQuery);
        // Handle search results
    };

    return (
        <div>
            <input
                type=\"text\"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder=\"Search chats...\"
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
}
```

### Participant Management

```typescript
function ChatParticipants({ userId, chatId }) {
    const chat = useUnifiedChat(userId, chatId);

    const addParticipant = async (participantId: string) => {
        await chat.addParticipant(chatId, participantId);
    };

    const removeParticipant = async (participantId: string) => {
        await chat.removeParticipant(chatId, participantId);
    };

    return (
        <div>
            <h3>Participants</h3>
            {chat.participants?.map(p => (
                <div key={p.id}>
                    <span>{p.username}</span>
                    <button onClick={() => removeParticipant(p.id)}>Remove</button>
                </div>
            ))}
            
            <button onClick={() => addParticipant('new-user-id')}>
                Add Participant
            </button>
        </div>
    );
}
```

## Styling Tips

### CSS Classes Used

```css
/* Basic chat styling */
.chat-app {
    display: flex;
    height: 100vh;
}

.chat-sidebar {
    width: 300px;
    border-right: 1px solid #eee;
}

.chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
}

.message {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 8px;
    background: #f5f5f5;
}

.message-input {
    padding: 20px;
    border-top: 1px solid #eee;
}

.message-input input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.performance-indicator {
    padding: 10px;
    background: #f0f8ff;
    border-bottom: 1px solid #ddd;
    font-size: 12px;
}

.error-container {
    padding: 20px;
    text-align: center;
}

.error-detail {
    color: #666;
    font-size: 12px;
    margin-top: 5px;
}
```

## Troubleshooting

### Common Issues

1. **WebSocket Connection Issues**
   ```typescript
   // Check if real-time is working
   const chat = useUnifiedChat(userId, chatId, { enableRealTime: true });
   // Monitor connection status in browser dev tools
   ```

2. **Performance Issues**
   ```typescript
   // Check performance summary
   const summary = chat.getPerformanceSummary?.();
   if (summary?.overall === 'poor') {
       console.log('Performance issues:', summary.issues);
   }
   ```

3. **Authentication Errors**
   ```typescript
   // Ensure user is authenticated
   const authStore = useAuthStore.getState();
   if (!authStore.data.accessToken) {
       // Redirect to login
   }
   ```

### Debug Mode

Enable detailed logging:

```typescript
// In your app setup
const container = new ChatDIContainer({
    enableLogging: true
});
```

## Next Steps

1. **Explore Advanced Features**: Read the [complete API documentation](./CHAT_API_DOCUMENTATION.md)
2. **Performance Optimization**: Monitor metrics and adjust cache strategies
3. **Real-time Features**: Implement typing indicators and online status
4. **Testing**: Add comprehensive tests for your chat implementation

## Support

For more information:
- Check the [API Documentation](./CHAT_API_DOCUMENTATION.md)
- Review the test files in `src/features/chat/__tests__/`
- Examine the implementation in `src/features/chat/application/hooks/`
