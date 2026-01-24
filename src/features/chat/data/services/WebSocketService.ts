/**
 * WebSocket Service
 * 
 * Provides real-time communication for chat features.
 * Handles WebSocket connections, message subscriptions, and real-time state management.
 */

import { Injectable } from '@/core/di';
import { CacheProvider } from '@/core/cache';
import { CHAT_CACHE_KEYS, CHAT_INVALIDATION_PATTERNS } from '../cache/ChatCacheKeys';
import type { MessageResponse } from '../models/chat';

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
  chatId?: string;
  userId?: string;
}

export interface WebSocketSubscription {
  id: string;
  pattern: string;
  callback: (message: WebSocketMessage) => void;
  createdAt: number;
}

@Injectable()
export class WebSocketService {
  private ws: WebSocket | null = null;
  private subscriptions: Map<string, WebSocketSubscription[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private connectionCallbacks: Set<() => void> = new Set();
  private disconnectionCallbacks: Set<() => void> = new Set();

  constructor(private cache: CacheProvider) {}

  /**
   * Connect to WebSocket server
   */
  async connect(url: string): Promise<void> {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(url);
        
        this.ws.onopen = () => {
          console.log('WebSocket connected successfully');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.connectionCallbacks.forEach(callback => callback());
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.isConnecting = false;
          this.disconnectionCallbacks.forEach(callback => callback());
          
          // Attempt reconnection if not a clean close
          if (event.code !== 1000) {
            this.attemptReconnect();
          }
        };

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.subscriptions.clear();
    this.connectionCallbacks.clear();
    this.disconnectionCallbacks.clear();
  }

  /**
   * Subscribe to WebSocket messages matching a pattern
   */
  subscribe(pattern: string, callback: (message: WebSocketMessage) => void): () => void {
    const subscription: WebSocketSubscription = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      pattern,
      callback,
      createdAt: Date.now()
    };

    if (!this.subscriptions.has(pattern)) {
      this.subscriptions.set(pattern, []);
    }
    
    this.subscriptions.get(pattern)!.push(subscription);

    // Return unsubscribe function
    return () => {
      const subs = this.subscriptions.get(pattern);
      if (subs) {
        const index = subs.findIndex(sub => sub.id === subscription.id);
        if (index !== -1) {
          subs.splice(index, 1);
        }
        
        if (subs.length === 0) {
          this.subscriptions.delete(pattern);
        }
      }
    };
  }

  /**
   * Send message through WebSocket
   */
  send(type: string, data: any, chatId?: string, userId?: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type,
        data,
        timestamp: Date.now(),
        chatId,
        userId
      };
      
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, message not sent:', { type, data });
    }
  }

  /**
   * Subscribe to chat messages
   */
  subscribeToChatMessages(chatId: string, callback: (message: MessageResponse) => void): () => void {
    return this.subscribe(`chat:${chatId}:message`, (message) => {
      if (message.type === 'message' && message.chatId === chatId) {
        callback(message.data as MessageResponse);
      }
    });
  }

  /**
   * Subscribe to typing indicators
   */
  subscribeToTypingIndicators(chatId: string, callback: (userIds: string[]) => void): () => void {
    return this.subscribe(`chat:${chatId}:typing`, (message) => {
      if (message.type === 'typing' && message.chatId === chatId) {
        callback(message.data.userIds);
      }
    });
  }

  /**
   * Subscribe to online status updates
   */
  subscribeToOnlineStatus(callback: (userId: string, isOnline: boolean) => void): () => void {
    return this.subscribe('user:online', (message) => {
      if (message.type === 'online_status') {
        callback(message.data.userId, message.data.isOnline);
      }
    });
  }

  /**
   * Send typing indicator
   */
  sendTypingIndicator(chatId: string, userId: string, isTyping: boolean): void {
    this.send('typing', { userId, isTyping }, chatId, userId);
  }

  /**
   * Send message through WebSocket
   */
  sendMessage(chatId: string, message: MessageResponse): void {
    this.send('message', message, chatId, String(message.senderId));
  }

  /**
   * Send online status
   */
  sendOnlineStatus(userId: string, isOnline: boolean): void {
    this.send('online_status', { userId, isOnline }, undefined, userId);
  }

  /**
   * Get connection status
   */
  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Get connection state
   */
  get connectionState(): 'connecting' | 'connected' | 'disconnected' | 'reconnecting' {
    if (this.isConnecting) return 'connecting';
    if (this.ws?.readyState === WebSocket.OPEN) return 'connected';
    if (this.reconnectAttempts > 0) return 'reconnecting';
    return 'disconnected';
  }

  /**
   * Add connection callback
   */
  onConnect(callback: () => void): () => void {
    this.connectionCallbacks.add(callback);
    return () => this.connectionCallbacks.delete(callback);
  }

  /**
   * Add disconnection callback
   */
  onDisconnect(callback: () => void): () => void {
    this.disconnectionCallbacks.add(callback);
    return () => this.disconnectionCallbacks.delete(callback);
  }

  /**
   * Get subscription statistics
   */
  getSubscriptionStats(): { totalSubscriptions: number; patterns: string[] } {
    const patterns = Array.from(this.subscriptions.keys());
    const totalSubscriptions = Array.from(this.subscriptions.values())
      .reduce((total, subs) => total + subs.length, 0);
    
    return { totalSubscriptions, patterns };
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(message: WebSocketMessage): void {
    // Find matching subscriptions
    const matchingPatterns = Array.from(this.subscriptions.keys())
      .filter(pattern => this.patternMatches(pattern, message));
    
    matchingPatterns.forEach(pattern => {
      const subscriptions = this.subscriptions.get(pattern);
      if (subscriptions) {
        subscriptions.forEach(subscription => {
          try {
            subscription.callback(message);
          } catch (error) {
            console.error('Error in subscription callback:', error);
          }
        });
      }
    });

    // Update cache based on message type
    this.updateCacheFromMessage(message);
  }

  /**
   * Check if message pattern matches subscription pattern
   */
  private patternMatches(pattern: string, message: WebSocketMessage): boolean {
    // Simple pattern matching - can be enhanced with regex
    if (pattern === '*') return true;
    
    if (pattern.includes(':')) {
      const [type, id] = pattern.split(':');
      if (message.type === type) {
        if (id === '*' || message.chatId === id || message.userId === id) {
          return true;
        }
      }
    } else if (message.type === pattern) {
      return true;
    }
    
    return false;
  }

  /**
   * Update cache based on incoming message
   */
  private updateCacheFromMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'message':
        if (message.chatId && message.data) {
          // Invalidate message cache for this chat
          this.cache.invalidatePattern(CHAT_INVALIDATION_PATTERNS.CHAT_MESSAGES(message.chatId));
          
          // Update unread count
          const unreadCacheKey = CHAT_CACHE_KEYS.UNREAD_COUNT(message.userId || '');
          const currentUnread = this.cache.get<number>(unreadCacheKey) || 0;
          this.cache.set(unreadCacheKey, currentUnread + 1);
        }
        break;
        
      case 'typing':
        if (message.chatId) {
          // Update typing indicators cache
          const typingCacheKey = CHAT_CACHE_KEYS.TYPING_INDICATORS(message.chatId);
          this.cache.set(typingCacheKey, message.data.userIds, 30000); // 30 seconds TTL
        }
        break;
        
      case 'online_status':
        if (message.data?.userId) {
          // Update online status cache
          const onlineCacheKey = CHAT_CACHE_KEYS.ONLINE_STATUS(message.data.userId);
          this.cache.set(onlineCacheKey, message.data.isOnline, 60000); // 1 minute TTL
        }
        break;
    }
  }

  /**
   * Attempt to reconnect WebSocket
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      // Reconnect to the same URL (would need to store the URL)
      this.connect('ws://localhost:8080/ws').catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }
}
