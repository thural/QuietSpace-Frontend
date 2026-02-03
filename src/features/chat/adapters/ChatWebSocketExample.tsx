/**
 * Chat WebSocket Example Component
 * 
 * Demonstrates how to use the Chat WebSocket Adapter for real-time chat functionality.
 * Shows integration with enterprise WebSocket infrastructure while maintaining
 * backward compatibility with existing chat components.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useDIContainer } from '@/core/modules/dependency-injection';
import { 
  ChatWebSocketAdapter,
  type IChatWebSocketAdapter,
  type ChatAdapterConfig,
  type ChatEventHandlers,
  type MessageResponse,
  type TypingIndicatorData,
  type OnlineStatusData
} from './index';
import { ResId } from '@/shared/api/models/common';

interface ChatWebSocketExampleProps {
  chatId: ResId;
  userId: ResId;
  onMessage?: (message: MessageResponse) => void;
  onTypingIndicator?: (userIds: ResId[]) => void;
  onOnlineStatus?: (userId: ResId, isOnline: boolean) => void;
}

/**
 * Example component demonstrating Chat WebSocket Adapter usage
 */
export const ChatWebSocketExample: React.FC<ChatWebSocketExampleProps> = ({
  chatId,
  userId,
  onMessage,
  onTypingIndicator,
  onOnlineStatus
}) => {
  const [adapter, setAdapter] = useState<IChatWebSocketAdapter | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [typingUsers, setTypingUsers] = useState<ResId[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<ResId[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const container = useDIContainer();

  // Initialize adapter
  useEffect(() => {
    const initializeAdapter = async () => {
      try {
        // Create adapter instance
        const chatAdapter = new ChatWebSocketAdapter(
          container.resolve('enterpriseWebSocketService'),
          container.resolve('messageRouter'),
          container.resolve('webSocketCacheManager')
        );

        // Configure adapter
        const config: Partial<ChatAdapterConfig> = {
          enableTypingIndicators: true,
          enableOnlineStatus: true,
          enableMessageDeliveryConfirmation: true,
          typingIndicatorTimeout: 3000,
          onlineStatusHeartbeat: 30000
        };

        await chatAdapter.initialize(config);

        // Set up event handlers
        const eventHandlers: ChatEventHandlers = {
          onMessage: (message) => {
            setMessages(prev => [...prev, message]);
            onMessage?.(message);
          },
          onTypingIndicator: (chatId, userIds) => {
            if (chatId === chatId) {
              setTypingUsers(userIds);
              onTypingIndicator?.(userIds);
            }
          },
          onOnlineStatus: (userId, isOnline) => {
            setOnlineUsers(prev => {
              if (isOnline && !prev.includes(userId)) {
                return [...prev, userId];
              } else if (!isOnline) {
                return prev.filter(id => id !== userId);
              }
              return prev;
            });
            onOnlineStatus?.(userId, isOnline);
          },
          onConnectionChange: (connected) => {
            setIsConnected(connected);
          },
          onError: (error) => {
            setError(error.message);
          }
        };

        chatAdapter.setEventHandlers(eventHandlers);

        // Subscribe to chat-specific events
        const unsubscribeMessages = chatAdapter.subscribeToMessages(chatId, (message) => {
          setMessages(prev => [...prev, message]);
        });

        const unsubscribeTyping = chatAdapter.subscribeToTypingIndicators(chatId, (userIds) => {
          setTypingUsers(userIds);
        });

        const unsubscribeOnline = chatAdapter.subscribeToOnlineStatus((userId, isOnline) => {
          setOnlineUsers(prev => {
            if (isOnline && !prev.includes(userId)) {
              return [...prev, userId];
            } else if (!isOnline) {
              return prev.filter(id => id !== userId);
            }
            return prev;
          });
        });

        setAdapter(chatAdapter);
        setIsConnected(chatAdapter.isConnected);

        // Cleanup function
        return () => {
          unsubscribeMessages();
          unsubscribeTyping();
          unsubscribeOnline();
        };

      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to initialize adapter');
      }
    };

    initializeAdapter();
  }, [chatId, userId, container, onMessage, onTypingIndicator, onOnlineStatus]);

  // Update metrics periodically
  useEffect(() => {
    if (!adapter) return;

    const interval = setInterval(() => {
      const currentMetrics = adapter.getMetrics();
      setMetrics(currentMetrics);
    }, 5000);

    return () => clearInterval(interval);
  }, [adapter]);

  // Message sending
  const sendMessage = useCallback(async (content: string) => {
    if (!adapter || !isConnected) {
      setError('Not connected to chat');
      return;
    }

    try {
      const message: MessageResponse = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        chatId,
        senderId: userId,
        content,
        timestamp: Date.now(),
        type: 'text'
      };

      await adapter.sendMessage(chatId, message);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send message');
    }
  }, [adapter, isConnected, chatId, userId]);

  // Typing indicator
  const sendTypingIndicator = useCallback(async (isTyping: boolean) => {
    if (!adapter || !isConnected) return;

    try {
      await adapter.sendTypingIndicator(chatId, userId, isTyping);
    } catch (error) {
      console.error('Failed to send typing indicator:', error);
    }
  }, [adapter, isConnected, chatId, userId]);

  // Online status
  const sendOnlineStatus = useCallback(async (isOnline: boolean) => {
    if (!adapter) return;

    try {
      await adapter.sendOnlineStatus(userId, isOnline);
    } catch (error) {
      console.error('Failed to send online status:', error);
    }
  }, [adapter, userId]);

  // Mark message as seen
  const markMessageAsSeen = useCallback(async (messageId: ResId) => {
    if (!adapter || !isConnected) return;

    try {
      await adapter.markMessageAsSeen(messageId, chatId);
    } catch (error) {
      console.error('Failed to mark message as seen:', error);
    }
  }, [adapter, isConnected, chatId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (adapter) {
        adapter.cleanup();
      }
    };
  }, [adapter]);

  return (
    <div className="chat-websocket-example">
      <div className="chat-header">
        <h3>Chat WebSocket Example</h3>
        <div className="connection-status">
          Status: {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      <div className="chat-info">
        <div>Chat ID: {chatId}</div>
        <div>User ID: {userId}</div>
        <div>Online Users: {onlineUsers.length}</div>
        <div>Typing Users: {typingUsers.length}</div>
      </div>

      <div className="metrics">
        <h4>Metrics:</h4>
        {metrics && (
          <pre>{JSON.stringify(metrics, null, 2)}</pre>
        )}
      </div>

      <div className="message-list">
        <h4>Messages ({messages.length}):</h4>
        {messages.map((message) => (
          <div key={message.id} className="message">
            <strong>User {message.senderId}:</strong> {message.content}
            <button onClick={() => markMessageAsSeen(message.id)}>
              Mark as Seen
            </button>
          </div>
        ))}
      </div>

      <div className="typing-indicators">
        <h4>Typing:</h4>
        {typingUsers.map((userId) => (
          <span key={userId}>User {userId} is typing...</span>
        ))}
      </div>

      <div className="online-users">
        <h4>Online:</h4>
        {onlineUsers.map((userId) => (
          <span key={userId}>User {userId}</span>
        ))}
      </div>

      <div className="message-input">
        <input
          type="text"
          placeholder="Type a message..."
          onFocus={() => sendTypingIndicator(true)}
          onBlur={() => sendTypingIndicator(false)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const target = e.target as HTMLInputElement;
              if (target.value.trim()) {
                sendMessage(target.value);
                target.value = '';
              }
            }
          }}
        />
        <button onClick={() => sendOnlineStatus(true)}>
          Go Online
        </button>
        <button onClick={() => sendOnlineStatus(false)}>
          Go Offline
        </button>
      </div>
    </div>
  );
};

export default ChatWebSocketExample;
