/**
 * Chat WebSocket Adapter
 * 
 * Bridges existing chat WebSocket implementations with the enterprise WebSocket infrastructure.
 * Provides chat-specific functionality while leveraging enterprise patterns for connection management,
 * message routing, caching, and monitoring.
 */

import { Injectable } from '@/core/di';
import { 
  IEnterpriseWebSocketService, 
  IMessageRouter,
  IWebSocketCacheManager 
} from '@/core/websocket';
import { WebSocketFeatureConfig, WebSocketMessage } from '@/core/websocket/types';
import { MessageResponse, ChatEvent } from '../models/chat';
import { ResId } from '@/shared/api/models/common';

// Chat-specific WebSocket message types
export interface ChatWebSocketMessage extends WebSocketMessage {
  feature: 'chat';
  messageType: 'message' | 'typing' | 'online_status' | 'presence' | 'chat_event';
  chatId?: string;
  userId?: string;
  data: any;
}

// Chat adapter configuration
export interface ChatAdapterConfig {
  enableTypingIndicators: boolean;
  enableOnlineStatus: boolean;
  enablePresenceManagement: boolean;
  enableMessageDeliveryConfirmation: boolean;
  typingIndicatorTimeout: number;
  onlineStatusHeartbeat: number;
  maxMessageRetries: number;
}

// Chat adapter metrics
export interface ChatAdapterMetrics {
  messagesSent: number;
  messagesReceived: number;
  typingIndicatorsSent: number;
  typingIndicatorsReceived: number;
  onlineStatusUpdates: number;
  connectionUptime: number;
  errorCount: number;
  lastActivity: number;
}

// Chat event handlers
export interface ChatEventHandlers {
  onMessage?: (message: MessageResponse) => void;
  onTypingIndicator?: (chatId: string, userIds: string[]) => void;
  onOnlineStatus?: (userId: string, isOnline: boolean) => void;
  onPresenceUpdate?: (userId: string, presence: any) => void;
  onChatEvent?: (event: ChatEvent) => void;
  onError?: (error: Error) => void;
  onConnectionChange?: (isConnected: boolean) => void;
}

/**
 * Chat WebSocket Adapter
 * 
 * Provides chat-specific WebSocket functionality using the enterprise infrastructure.
 * Maintains backward compatibility with existing chat components while adding enterprise features.
 */
@Injectable()
export class ChatWebSocketAdapter {
  private config: ChatAdapterConfig;
  private metrics: ChatAdapterMetrics;
  private eventHandlers: ChatEventHandlers = {};
  private typingIndicators: Map<string, Set<string>> = new Map();
  private onlineUsers: Set<string> = new Set();
  private messageDeliveryCallbacks: Map<string, (success: boolean) => void> = new Map();
  private isInitialized = false;
  private startTime = Date.now();

  constructor(
    private enterpriseWebSocket: IEnterpriseWebSocketService,
    private messageRouter: IMessageRouter,
    private cacheManager: IWebSocketCacheManager
  ) {
    this.config = this.getDefaultConfig();
    this.metrics = this.getDefaultMetrics();
  }

  /**
   * Initialize the chat WebSocket adapter
   */
  async initialize(config?: Partial<ChatAdapterConfig>): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    // Merge configuration
    this.config = { ...this.config, ...config };

    // Register chat feature with enterprise WebSocket
    const featureConfig: WebSocketFeatureConfig = {
      name: 'chat',
      enabled: true,
      priority: 1,
      maxConnections: 5,
      heartbeatInterval: this.config.onlineStatusHeartbeat,
      reconnectAttempts: 5,
      messageValidation: true,
      cacheInvalidation: true,
      customRoutes: this.getChatMessageRoutes()
    };

    await this.enterpriseWebSocket.registerFeature(featureConfig);

    // Register message handlers with enterprise router
    await this.registerMessageHandlers();

    // Set up connection monitoring
    this.setupConnectionMonitoring();

    this.isInitialized = true;
    this.startTime = Date.now();
  }

  /**
   * Send a chat message
   */
  async sendMessage(chatId: string, message: MessageResponse): Promise<void> {
    try {
      const chatMessage: ChatWebSocketMessage = {
        id: `chat_msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        feature: 'chat',
        messageType: 'message',
        type: 'chat_message',
        chatId,
        userId: String(message.senderId),
        data: message,
        timestamp: Date.now(),
        priority: 'high'
      };

      await this.enterpriseWebSocket.sendMessage(chatMessage);
      this.metrics.messagesSent++;
      this.metrics.lastActivity = Date.now();

      // Update cache
      await this.updateMessageCache(chatId, message);

    } catch (error) {
      this.metrics.errorCount++;
      this.eventHandlers.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Send typing indicator
   */
  async sendTypingIndicator(chatId: string, userId: string, isTyping: boolean): Promise<void> {
    if (!this.config.enableTypingIndicators) {
      return;
    }

    try {
      const typingMessage: ChatWebSocketMessage = {
        id: `typing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        feature: 'chat',
        messageType: 'typing',
        type: 'typing_indicator',
        chatId,
        userId,
        data: { userId, isTyping },
        timestamp: Date.now(),
        priority: 'low'
      };

      await this.enterpriseWebSocket.sendMessage(typingMessage);
      this.metrics.typingIndicatorsSent++;
      this.metrics.lastActivity = Date.now();

      // Update local typing indicators
      this.updateLocalTypingIndicator(chatId, userId, isTyping);

    } catch (error) {
      this.metrics.errorCount++;
      this.eventHandlers.onError?.(error as Error);
    }
  }

  /**
   * Send online status
   */
  async sendOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    if (!this.config.enableOnlineStatus) {
      return;
    }

    try {
      const statusMessage: ChatWebSocketMessage = {
        id: `status_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        feature: 'chat',
        messageType: 'online_status',
        type: 'online_status',
        userId,
        data: { userId, isOnline },
        timestamp: Date.now(),
        priority: 'medium'
      };

      await this.enterpriseWebSocket.sendMessage(statusMessage);
      this.metrics.onlineStatusUpdates++;
      this.metrics.lastActivity = Date.now();

      // Update local online status
      if (isOnline) {
        this.onlineUsers.add(userId);
      } else {
        this.onlineUsers.delete(userId);
      }

    } catch (error) {
      this.metrics.errorCount++;
      this.eventHandlers.onError?.(error as Error);
    }
  }

  /**
   * Delete a chat message
   */
  async deleteMessage(messageId: ResId, chatId: string): Promise<void> {
    try {
      const deleteMessage: ChatWebSocketMessage = {
        id: `delete_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        feature: 'chat',
        messageType: 'chat_event',
        type: 'delete_message',
        chatId,
        data: { messageId, chatId },
        timestamp: Date.now(),
        priority: 'high'
      };

      await this.enterpriseWebSocket.sendMessage(deleteMessage);
      this.metrics.lastActivity = Date.now();

    } catch (error) {
      this.metrics.errorCount++;
      this.eventHandlers.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Mark message as seen
   */
  async markMessageAsSeen(messageId: ResId, chatId: string): Promise<void> {
    try {
      const seenMessage: ChatWebSocketMessage = {
        id: `seen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        feature: 'chat',
        messageType: 'chat_event',
        type: 'seen_message',
        chatId,
        data: { messageId, chatId },
        timestamp: Date.now(),
        priority: 'medium'
      };

      await this.enterpriseWebSocket.sendMessage(seenMessage);
      this.metrics.lastActivity = Date.now();

    } catch (error) {
      this.metrics.errorCount++;
      this.eventHandlers.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Subscribe to chat messages
   */
  subscribeToMessages(chatId: string, callback: (message: MessageResponse) => void): () => void {
    const unsubscribe = this.messageRouter.subscribe(
      { feature: 'chat', messageType: 'message', chatId },
      async (message: ChatWebSocketMessage) => {
        if (message.chatId === chatId) {
          this.metrics.messagesReceived++;
          this.metrics.lastActivity = Date.now();
          callback(message.data as MessageResponse);
        }
      }
    );

    return unsubscribe;
  }

  /**
   * Subscribe to typing indicators
   */
  subscribeToTypingIndicators(chatId: string, callback: (userIds: string[]) => void): () => void {
    const unsubscribe = this.messageRouter.subscribe(
      { feature: 'chat', messageType: 'typing', chatId },
      async (message: ChatWebSocketMessage) => {
        if (message.chatId === chatId) {
          this.metrics.typingIndicatorsReceived++;
          this.metrics.lastActivity = Date.now();
          this.updateLocalTypingIndicator(chatId, message.data.userId, message.data.isTyping);
          callback(Array.from(this.typingIndicators.get(chatId) || []));
        }
      }
    );

    return unsubscribe;
  }

  /**
   * Subscribe to online status updates
   */
  subscribeToOnlineStatus(callback: (userId: string, isOnline: boolean) => void): () => void {
    const unsubscribe = this.messageRouter.subscribe(
      { feature: 'chat', messageType: 'online_status' },
      async (message: ChatWebSocketMessage) => {
        this.metrics.onlineStatusUpdates++;
        this.metrics.lastActivity = Date.now();
        
        const { userId, isOnline } = message.data;
        if (isOnline) {
          this.onlineUsers.add(userId);
        } else {
          this.onlineUsers.delete(userId);
        }
        
        callback(userId, isOnline);
      }
    );

    return unsubscribe;
  }

  /**
   * Subscribe to chat events
   */
  subscribeToChatEvents(callback: (event: ChatEvent) => void): () => void {
    const unsubscribe = this.messageRouter.subscribe(
      { feature: 'chat', messageType: 'chat_event' },
      async (message: ChatWebSocketMessage) => {
        this.metrics.lastActivity = Date.now();
        callback(message.data as ChatEvent);
      }
    );

    return unsubscribe;
  }

  /**
   * Get current connection status
   */
  get isConnected(): boolean {
    return this.enterpriseWebSocket.isConnected;
  }

  /**
   * Get connection state
   */
  get connectionState(): 'connecting' | 'connected' | 'disconnected' | 'reconnecting' {
    return this.enterpriseWebSocket.connectionState;
  }

  /**
   * Get adapter metrics
   */
  getMetrics(): ChatAdapterMetrics {
    return {
      ...this.metrics,
      connectionUptime: Date.now() - this.startTime
    };
  }

  /**
   * Get typing indicators for a chat
   */
  getTypingIndicators(chatId: string): string[] {
    return Array.from(this.typingIndicators.get(chatId) || []);
  }

  /**
   * Get online users
   */
  getOnlineUsers(): string[] {
    return Array.from(this.onlineUsers);
  }

  /**
   * Set event handlers
   */
  setEventHandlers(handlers: ChatEventHandlers): void {
    this.eventHandlers = { ...this.eventHandlers, ...handlers };
  }

  /**
   * Cleanup adapter resources
   */
  async cleanup(): Promise<void> {
    this.typingIndicators.clear();
    this.onlineUsers.clear();
    this.messageDeliveryCallbacks.clear();
    this.eventHandlers = {};
    
    await this.enterpriseWebSocket.unregisterFeature('chat');
    this.isInitialized = false;
  }

  /**
   * Get default configuration
   */
  private getDefaultConfig(): ChatAdapterConfig {
    return {
      enableTypingIndicators: true,
      enableOnlineStatus: true,
      enablePresenceManagement: true,
      enableMessageDeliveryConfirmation: true,
      typingIndicatorTimeout: 3000,
      onlineStatusHeartbeat: 30000,
      maxMessageRetries: 3
    };
  }

  /**
   * Get default metrics
   */
  private getDefaultMetrics(): ChatAdapterMetrics {
    return {
      messagesSent: 0,
      messagesReceived: 0,
      typingIndicatorsSent: 0,
      typingIndicatorsReceived: 0,
      onlineStatusUpdates: 0,
      connectionUptime: 0,
      errorCount: 0,
      lastActivity: Date.now()
    };
  }

  /**
   * Get chat-specific message routes
   */
  private getChatMessageRoutes(): any[] {
    return [
      {
        pattern: { feature: 'chat', messageType: 'message' },
        handler: 'handleChatMessage',
        priority: 'high',
        validation: true
      },
      {
        pattern: { feature: 'chat', messageType: 'typing' },
        handler: 'handleTypingIndicator',
        priority: 'low',
        validation: false
      },
      {
        pattern: { feature: 'chat', messageType: 'online_status' },
        handler: 'handleOnlineStatus',
        priority: 'medium',
        validation: false
      },
      {
        pattern: { feature: 'chat', messageType: 'chat_event' },
        handler: 'handleChatEvent',
        priority: 'high',
        validation: true
      }
    ];
  }

  /**
   * Register message handlers with enterprise router
   */
  private async registerMessageHandlers(): Promise<void> {
    // Register chat message handler
    this.messageRouter.registerHandler(
      'handleChatMessage',
      async (message: ChatWebSocketMessage) => {
        this.eventHandlers.onMessage?.(message.data as MessageResponse);
      }
    );

    // Register typing indicator handler
    this.messageRouter.registerHandler(
      'handleTypingIndicator',
      async (message: ChatWebSocketMessage) => {
        const { chatId, userId, isTyping } = message.data;
        this.updateLocalTypingIndicator(chatId, userId, isTyping);
        this.eventHandlers.onTypingIndicator?.(chatId, this.getTypingIndicators(chatId));
      }
    );

    // Register online status handler
    this.messageRouter.registerHandler(
      'handleOnlineStatus',
      async (message: ChatWebSocketMessage) => {
        const { userId, isOnline } = message.data;
        if (isOnline) {
          this.onlineUsers.add(userId);
        } else {
          this.onlineUsers.delete(userId);
        }
        this.eventHandlers.onOnlineStatus?.(userId, isOnline);
      }
    );

    // Register chat event handler
    this.messageRouter.registerHandler(
      'handleChatEvent',
      async (message: ChatWebSocketMessage) => {
        this.eventHandlers.onChatEvent?.(message.data as ChatEvent);
      }
    );
  }

  /**
   * Set up connection monitoring
   */
  private setupConnectionMonitoring(): void {
    this.enterpriseWebSocket.onConnect(() => {
      this.eventHandlers.onConnectionChange?.(true);
    });

    this.enterpriseWebSocket.onDisconnect(() => {
      this.eventHandlers.onConnectionChange?.(false);
    });
  }

  /**
   * Update local typing indicators
   */
  private updateLocalTypingIndicator(chatId: string, userId: string, isTyping: boolean): void {
    if (!this.typingIndicators.has(chatId)) {
      this.typingIndicators.set(chatId, new Set());
    }

    const chatTyping = this.typingIndicators.get(chatId)!;
    
    if (isTyping) {
      chatTyping.add(userId);
      
      // Auto-remove typing indicator after timeout
      setTimeout(() => {
        chatTyping.delete(userId);
        this.eventHandlers.onTypingIndicator?.(chatId, Array.from(chatTyping));
      }, this.config.typingIndicatorTimeout);
    } else {
      chatTyping.delete(userId);
    }
  }

  /**
   * Update message cache
   */
  private async updateMessageCache(chatId: string, message: MessageResponse): Promise<void> {
    try {
      const cacheKey = `chat:${chatId}:messages`;
      await this.cacheManager.set(cacheKey, message, 300000); // 5 minutes TTL
      
      // Invalidate chat list cache
      await this.cacheManager.invalidatePattern(`chat:${chatId}:*`);
    } catch (error) {
      console.error('Failed to update message cache:', error);
    }
  }
}
