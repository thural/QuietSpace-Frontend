/**
 * Chat WebSocket Hook
 * 
 * Specialized hook for chat WebSocket functionality.
 * Provides chat-specific operations with enterprise integration.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useDIContainer } from '@/core/di';
import { useChatDI } from '@/features/chat/di';
import { ChatWebSocketAdapter } from '@/features/chat/adapters';
import type {
  ChatWebSocketMessage,
  ChatEventHandlers,
  ChatSubscriptionOptions
} from '@/features/chat/adapters';
import type { MessageResponse } from '@/features/chat/data/models/chat';

// Chat hook configuration
export interface UseChatWebSocketConfig {
  autoConnect?: boolean;
  enablePresence?: boolean;
  enableTypingIndicators?: boolean;
  enableReadReceipts?: boolean;
  enableMessageHistory?: boolean;
  maxHistorySize?: number;
  presenceUpdateInterval?: number;
  typingTimeout?: number;
}

// Chat hook state
export interface ChatWebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  messages: MessageResponse[];
  presence: Record<string, any>;
  typingUsers: Record<string, boolean>;
  unreadCount: number;
  activeChats: string[];
  metrics: any;
}

// Chat hook return value
export interface UseChatWebSocketReturn extends ChatWebSocketState {
  // Connection management
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;

  // Message operations
  sendMessage: (chatId: string, content: string, type?: string) => Promise<void>;
  sendTypingIndicator: (chatId: string, isTyping: boolean) => Promise<void>;
  markMessagesAsRead: (chatId: string, messageIds?: string[]) => Promise<void>;

  // Subscription management
  subscribeToChat: (chatId: string, options?: ChatSubscriptionOptions) => () => void;
  subscribeToPresence: (callback: (presence: Record<string, any>) => void) => () => void;
  subscribeToTyping: (callback: (typingUsers: Record<string, boolean>) => void) => () => void;

  // Chat management
  joinChat: (chatId: string) => Promise<void>;
  leaveChat: (chatId: string) => Promise<void>;

  // Utilities
  clearHistory: () => void;
  getMetrics: () => any;
  reset: () => void;
}

/**
 * Chat WebSocket hook
 */
export function useChatWebSocket(config: UseChatWebSocketConfig = {}): UseChatWebSocketReturn {
  const mainContainer = useDIContainer();
  const chatDI = useChatDI();

  const {
    autoConnect = true,
    enablePresence = true,
    enableTypingIndicators = true,
    enableReadReceipts = true,
    enableMessageHistory = true,
    maxHistorySize = 100,
    presenceUpdateInterval = 30000,
    typingTimeout = 3000
  } = config;

  const [state, setState] = useState<ChatWebSocketState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    messages: [],
    presence: {},
    typingUsers: {},
    unreadCount: 0,
    activeChats: [],
    metrics: {}
  });

  // Refs for cleanup and state management
  const adapterRef = useRef<ChatWebSocketAdapter | null>(null);
  const subscriptionsRef = useRef<Map<string, () => void>>(new Map());
  const typingTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const presenceIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize adapter
  const initializeAdapter = useCallback(async () => {
    try {
      const adapter = chatDI.getChatWebSocketAdapter();
      await adapter.initialize();

      adapterRef.current = adapter;

      // Set up event handlers
      const eventHandlers: ChatEventHandlers = {
        onMessage: (message) => {
          setState(prev => {
            const newMessages = enableMessageHistory
              ? [message, ...prev.messages.slice(0, maxHistorySize - 1)]
              : prev.messages;

            return {
              ...prev,
              messages: newMessages,
              unreadCount: message.isSeen ? prev.unreadCount : prev.unreadCount + 1
            };
          });
        },

        onPresenceUpdate: (presence) => {
          setState(prev => ({ ...prev, presence }));
        },

        onTypingIndicator: (chatId, userIds) => {
          setState(prev => {
            const newTypingUsers = { ...prev.typingUsers };

            // Clear existing typing indicators for this chat
            Object.keys(newTypingUsers).forEach(key => {
              if (key.startsWith(`${chatId}:`)) {
                const timeout = typingTimeoutsRef.current.get(key);
                if (timeout) {
                  clearTimeout(timeout);
                  typingTimeoutsRef.current.delete(key);
                }
                delete newTypingUsers[key];
              }
            });

            // Set new typing indicators
            userIds.forEach(userId => {
              const typingKey = `${chatId}:${userId}`;
              newTypingUsers[typingKey] = true;

              // Set timeout to clear typing indicator
              const timeout = setTimeout(() => {
                setState(prev => {
                  const updatedTyping = { ...prev.typingUsers };
                  delete updatedTyping[typingKey];
                  return { ...prev, typingUsers: updatedTyping };
                });
                typingTimeoutsRef.current.delete(typingKey);
              }, typingTimeout);

              typingTimeoutsRef.current.set(typingKey, timeout);
            });

            return { ...prev, typingUsers: newTypingUsers };
          });
        },

        onConnectionChange: (isConnected) => {
          setState(prev => ({
            ...prev,
            isConnected,
            isConnecting: false
          }));
        },

        onError: (error) => {
          setState(prev => ({
            ...prev,
            error: error.message,
            isConnecting: false
          }));
        }
      };

      adapter.setEventHandlers(eventHandlers);

      setState(prev => ({
        ...prev,
        isConnected: adapter.isConnected,
        metrics: adapter.getMetrics()
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to initialize chat adapter',
        isConnecting: false
      }));
    }
  }, [chatDI, enableMessageHistory, maxHistorySize, typingTimeout]);

  // Connect to WebSocket
  const connect = useCallback(async () => {
    if (!adapterRef.current) {
      await initializeAdapter();
    }

    if (!adapterRef.current) {
      throw new Error('Chat adapter not initialized');
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      await adapterRef.current.initialize();
      setState(prev => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        error: null
      }));

      // Start presence updates if enabled
      if (enablePresence && presenceIntervalRef.current) {
        presenceIntervalRef.current = setInterval(async () => {
          if (adapterRef.current) {
            try {
              await adapterRef.current.updatePresence();
            } catch (error) {
              console.error('Failed to update presence:', error);
            }
          }
        }, presenceUpdateInterval);
      }

    } catch (error) {
      setState(prev => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Connection failed'
      }));
    }
  }, [initializeAdapter, enablePresence, presenceUpdateInterval]);

  // Disconnect from WebSocket
  const disconnect = useCallback(async () => {
    if (presenceIntervalRef.current) {
      clearInterval(presenceIntervalRef.current);
      presenceIntervalRef.current = null;
    }

    // Clear all typing timeouts
    typingTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    typingTimeoutsRef.current.clear();

    // Clear all subscriptions
    subscriptionsRef.current.forEach(unsubscribe => unsubscribe());
    subscriptionsRef.current.clear();

    try {
      if (adapterRef.current) {
        await adapterRef.current.disconnect();
      }

      setState(prev => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Disconnection failed'
      }));
    }
  }, []);

  // Send message
  const sendMessage = useCallback(async (chatId: string, content: string, type = 'text') => {
    if (!adapterRef.current) {
      throw new Error('Chat adapter not initialized');
    }

    try {
      await adapterRef.current.sendMessage(chatId, content, type);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to send message'
      }));
      throw error;
    }
  }, []);

  // Send typing indicator
  const sendTypingIndicator = useCallback(async (chatId: string, isTyping: boolean) => {
    if (!adapterRef.current || !enableTypingIndicators) {
      return;
    }

    try {
      await adapterRef.current.sendTypingIndicator(chatId, isTyping);
    } catch (error) {
      console.error('Failed to send typing indicator:', error);
    }
  }, [enableTypingIndicators]);

  // Mark messages as read
  const markMessagesAsRead = useCallback(async (chatId: string, messageIds?: string[]) => {
    if (!adapterRef.current || !enableReadReceipts) {
      return;
    }

    try {
      await adapterRef.current.markMessagesAsRead(chatId, messageIds);
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  }, [enableReadReceipts]);

  // Subscribe to chat
  const subscribeToChat = useCallback((chatId: string, options?: ChatSubscriptionOptions) => {
    if (!adapterRef.current) {
      throw new Error('Chat adapter not initialized');
    }

    const unsubscribe = adapterRef.current.subscribeToChat(chatId, options);
    subscriptionsRef.current.set(chatId, unsubscribe);

    setState(prev => ({
      ...prev,
      activeChats: prev.activeChats.includes(chatId)
        ? prev.activeChats
        : [...prev.activeChats, chatId]
    }));

    return () => {
      unsubscribe();
      subscriptionsRef.current.delete(chatId);
      setState(prev => ({
        ...prev,
        activeChats: prev.activeChats.filter(id => id !== chatId)
      }));
    };
  }, []);

  // Subscribe to presence
  const subscribeToPresence = useCallback((callback: (presence: Record<string, any>) => void) => {
    if (!adapterRef.current) {
      throw new Error('Chat adapter not initialized');
    }

    const unsubscribe = adapterRef.current.subscribeToPresence(callback);
    subscriptionsRef.current.set('presence', unsubscribe);

    return unsubscribe;
  }, []);

  // Subscribe to typing indicators
  const subscribeToTyping = useCallback((callback: (typingUsers: Record<string, boolean>) => void) => {
    if (!adapterRef.current) {
      throw new Error('Chat adapter not initialized');
    }

    const unsubscribe = adapterRef.current.subscribeToTyping(callback);
    subscriptionsRef.current.set('typing', unsubscribe);

    return unsubscribe;
  }, []);

  // Join chat
  const joinChat = useCallback(async (chatId: string) => {
    if (!adapterRef.current) {
      throw new Error('Chat adapter not initialized');
    }

    try {
      await adapterRef.current.joinChat(chatId);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to join chat'
      }));
      throw error;
    }
  }, []);

  // Leave chat
  const leaveChat = useCallback(async (chatId: string) => {
    if (!adapterRef.current) {
      throw new Error('Chat adapter not initialized');
    }

    try {
      await adapterRef.current.leaveChat(chatId);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to leave chat'
      }));
      throw error;
    }
  }, []);

  // Clear message history
  const clearHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: [],
      unreadCount: 0
    }));
  }, []);

  // Get metrics
  const getMetrics = useCallback(() => {
    if (!adapterRef.current) {
      return null;
    }

    const metrics = adapterRef.current.getMetrics();
    setState(prev => ({ ...prev, metrics }));
    return metrics;
  }, []);

  // Reset hook state
  const reset = useCallback(() => {
    disconnect();

    setState({
      isConnected: false,
      isConnecting: false,
      error: null,
      messages: [],
      presence: {},
      typingUsers: {},
      unreadCount: 0,
      activeChats: [],
      metrics: null
    });
  }, [disconnect]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      reset();
    };
  }, [autoConnect, connect, reset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    sendMessage,
    sendTypingIndicator,
    markMessagesAsRead,
    subscribeToChat,
    subscribeToPresence,
    subscribeToTyping,
    joinChat,
    leaveChat,
    clearHistory,
    getMetrics,
    reset
  };
}

export default useChatWebSocket;
