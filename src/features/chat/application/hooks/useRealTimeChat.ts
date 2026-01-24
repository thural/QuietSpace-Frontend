/**
 * Real-time Chat Hook
 * 
 * Provides real-time chat functionality with WebSocket integration.
 * Handles live messages, typing indicators, and online status.
 */

import {useCallback, useEffect, useRef, useState} from 'react';
import {useCustomMutation, useCustomQuery} from '@/core/hooks';
import {useChatServices} from './useChatServices';
import {CACHE_TIME_MAPPINGS, useCacheInvalidation} from '@/core/hooks/migrationUtils';
import {CHAT_CACHE_KEYS} from '@chat/data/cache/ChatCacheKeys';
import type {MessageResponse} from '../../data/models/chat';

export interface RealTimeChatState {
  messages: MessageResponse[];
  typingUsers: string[];
  onlineUsers: Record<string, boolean>;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
  isConnected: boolean;
  isTyping: boolean;
}

export interface RealTimeChatActions {
  sendMessage: (content: string) => void;
  setTyping: (isTyping: boolean) => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshMessages: () => void;
}

export const useRealTimeChat = (chatId: string): RealTimeChatState & RealTimeChatActions => {
  const { chatDataService } = useChatServices();
  const invalidateCache = useCacheInvalidation();
  
  // State for real-time data
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<RealTimeChatState['connectionStatus']>('disconnected');
  
  // Refs for cleanup
  const messageSubscriptionRef = useRef<(() => void) | null>(null);
  const typingSubscriptionRef = useRef<(() => void) | null>(null);
  const onlineSubscriptionRef = useRef<(() => void) | null>(null);
  const connectionCallbackRef = useRef<(() => void) | null>(null);
  const disconnectionCallbackRef = useRef<(() => void) | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get initial messages with custom query
  const { data: initialMessages, refetch: refetchMessages } = useCustomQuery(
    ['chat', 'messages', chatId],
    () => chatDataService.getMessages(chatId, 0, ''),
    {
      enabled: !!chatId,
      staleTime: CACHE_TIME_MAPPINGS.REALTIME_STALE_TIME,
      cacheTime: CACHE_TIME_MAPPINGS.REALTIME_CACHE_TIME,
      onSuccess: (data) => {
        console.log('RealTimeChat: Initial messages loaded:', { chatId, count: data.content?.length || 0 });
        setMessages(data.content || []);
      },
      onError: (error) => {
        console.error('RealTimeChat: Error loading messages:', error);
      }
    }
  );
  
  // Get typing indicators with custom query
  const { data: typingIndicators } = useCustomQuery(
    ['chat', 'typing', chatId],
    () => chatDataService.getTypingIndicators(chatId),
    {
      staleTime: 0, // Always fresh for real-time
      cacheTime: 30000, // 30 seconds
      refetchInterval: 10000, // 10 seconds
      onSuccess: (data) => {
        setTypingUsers(data);
      }
    }
  );
  
  // Get online status with custom query
  const { data: onlineStatus } = useCustomQuery(
    ['chat', 'online-status'],
    () => chatDataService.getOnlineStatus(''), // This would be enhanced to get multiple users
    {
      staleTime: 0, // Always fresh for real-time
      cacheTime: 60000, // 1 minute
      refetchInterval: 30000 // 30 seconds
    }
  );
  
  // Send message mutation with real-time updates
  const { mutate: sendMessageMutation, isLoading: isSending } = useCustomMutation(
    async (content: string) => {
      const messageData = {
        content,
        type: 'text',
        timestamp: new Date().toISOString()
      };
      
      return await chatDataService.sendMessage(chatId, messageData, '');
    },
    {
      onSuccess: (newMessage) => {
        console.log('RealTimeChat: Message sent successfully:', newMessage.id);
        // Real-time message will be handled by WebSocket subscription
      },
      onError: (error) => {
        console.error('RealTimeChat: Error sending message:', error);
      },
      optimisticUpdate: (cache, variables) => {
        const optimisticMessage: MessageResponse = {
          id: `temp-${Date.now()}`,
          chatId,
          text: variables,
          senderId: 'current-user', // This would come from auth
          recipientId: '', // This would come from chat context
          createDate: new Date().toISOString()
        };
        
        // Add to local state optimistically
        setMessages(prev => [optimisticMessage, ...prev]);
        
        // Add to cache optimistically
        const cacheKey = CHAT_CACHE_KEYS.MESSAGES(chatId, 0);
        const existingMessages = cache.get<any>(cacheKey) || { content: [] };
        cache.set(cacheKey, {
          ...existingMessages,
          content: [optimisticMessage, ...existingMessages.content]
        });
        
        return () => {
          // Rollback on error
          setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
          
          const updatedMessages = cache.get<any>(cacheKey) || { content: [] };
          const filtered = updatedMessages.content.filter((msg: any) => msg.id !== optimisticMessage.id);
          cache.set(cacheKey, {
            ...updatedMessages,
            content: filtered
          });
        };
      },
      retry: 2,
      retryDelay: 1000
    }
  );
  
  // Connect to WebSocket
  const connect = useCallback(async () => {
    try {
      setConnectionStatus('connecting');
      await chatDataService.connectWebSocket('ws://localhost:8080/ws');
      setConnectionStatus('connected');
    } catch (error) {
      console.error('RealTimeChat: Failed to connect:', error);
      setConnectionStatus('disconnected');
    }
  }, [chatDataService]);
  
  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    chatDataService.disconnectWebSocket();
    setConnectionStatus('disconnected');
  }, [chatDataService]);
  
  // Send message
  const sendMessage = useCallback((content: string) => {
    if (!content.trim() || isSending) return;
    
    sendMessageMutation(content);
  }, [sendMessageMutation, isSending]);
  
  // Set typing indicator with debounce
  const setTyping = useCallback((isTyping: boolean) => {
    setIsTyping(isTyping);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    if (isTyping) {
      // Send typing indicator immediately
      chatDataService.setTypingIndicator(chatId, 'current-user', true);
      
      // Set timeout to stop typing after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        chatDataService.setTypingIndicator(chatId, 'current-user', false);
        setIsTyping(false);
      }, 3000);
    } else {
      // Send stop typing immediately
      chatDataService.setTypingIndicator(chatId, 'current-user', false);
    }
  }, [chatDataService]);
  
  // Refresh messages
  const refreshMessages = useCallback(() => {
    refetchMessages();
  }, [refetchMessages]);
  
  // Set up real-time subscriptions
  useEffect(() => {
    if (!chatId) return;
    
    // Subscribe to real-time messages
    messageSubscriptionRef.current = chatDataService.subscribeToChatMessages(chatId, (message) => {
      console.log('RealTimeChat: Received real-time message:', message.id);
      setMessages(prev => {
        // Check if message already exists (avoid duplicates)
        const exists = prev.some(msg => msg.id === message.id);
        if (exists) return prev;
        
        // Add new message
        return [...prev, message];
      });
    });
    
    // Subscribe to typing indicators
    typingSubscriptionRef.current = chatDataService.subscribeToTypingIndicators(chatId, (userIds) => {
      console.log('RealTimeChat: Typing indicators updated:', userIds);
      setTypingUsers(userIds);
    });
    
    // Subscribe to online status
    onlineSubscriptionRef.current = chatDataService.subscribeToOnlineStatus((userId, isOnline) => {
      console.log('RealTimeChat: Online status updated:', { userId, isOnline });
      setOnlineUsers(prev => ({
        ...prev,
        [userId]: isOnline
      }));
    });
    
    // Subscribe to connection events
    connectionCallbackRef.current = chatDataService.onConnect(() => {
      console.log('RealTimeChat: WebSocket connected');
      setConnectionStatus('connected');
    });
    
    disconnectionCallbackRef.current = chatDataService.onDisconnect(() => {
      console.log('RealTimeChat: WebSocket disconnected');
      setConnectionStatus('disconnected');
    });
    
    // Update connection status from service
    const updateConnectionStatus = () => {
      setConnectionStatus(chatDataService.getWebSocketStatus());
    };
    
    // Poll connection status every 5 seconds
    const statusInterval = setInterval(updateConnectionStatus, 5000);
    
    return () => {
      // Cleanup subscriptions
      if (messageSubscriptionRef.current) {
        messageSubscriptionRef.current();
        messageSubscriptionRef.current = null;
      }
      
      if (typingSubscriptionRef.current) {
        typingSubscriptionRef.current();
        typingSubscriptionRef.current = null;
      }
      
      if (onlineSubscriptionRef.current) {
        onlineSubscriptionRef.current();
        onlineSubscriptionRef.current = null;
      }
      
      if (connectionCallbackRef.current) {
        connectionCallbackRef.current();
        connectionCallbackRef.current = null;
      }
      
      if (disconnectionCallbackRef.current) {
        disconnectionCallbackRef.current();
        disconnectionCallbackRef.current = null;
      }
      
      clearInterval(statusInterval);
      
      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    };
  }, [chatId, chatDataService]);
  
  // Update typing users from cache
  useEffect(() => {
    if (typingIndicators) {
      setTypingUsers(typingIndicators);
    }
  }, [typingIndicators]);
  
  return {
    // State
    messages,
    typingUsers,
    onlineUsers,
    connectionStatus,
    isConnected: connectionStatus === 'connected',
    isTyping,
    
    // Actions
    sendMessage,
    setTyping,
    connect,
    disconnect,
    refreshMessages
  };
};
