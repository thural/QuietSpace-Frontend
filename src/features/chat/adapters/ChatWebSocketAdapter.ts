/**
 * Chat WebSocket Adapter
 * 
 * Bridges existing chat WebSocket implementations with the enterprise WebSocket infrastructure.
 * Provides chat-specific functionality while leveraging enterprise patterns for connection management,
 * message routing, caching, and monitoring.
 */

import { Injectable } from '@/core/di';
import type {
    IEnterpriseWebSocketService,
    IMessageRouter,
    IWebSocketCacheManager,
    WebSocketMessage,
    MessageRoute,
    MessageHandler
} from '@/core/websocket';
import { MessageResponse, ChatEvent } from '../data/models/chat';
import { ResId } from '@/shared/api/models/common';
import {
    ChatEventHandlers,
    ChatAdapterConfig,
    ChatAdapterMetrics,
    PresenceData,
    ChatWebSocketError
} from './ChatWebSocketTypes';

// Chat-specific WebSocket message types
export interface ChatWebSocketMessage extends Omit<WebSocketMessage, 'id' | 'timestamp'> {
    feature: 'chat';
    messageType: 'message' | 'typing' | 'online_status' | 'presence' | 'chat_event';
    chatId?: string;
    userId?: string;
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
    private unsubscribeFunctions: (() => void)[] = [];

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

        // Register message handlers with enterprise router
        await this.registerMessageHandlers();

        // Subscribe to chat messages from enterprise WebSocket
        this.subscribeToEnterpriseWebSocket();

        this.isInitialized = true;
        this.startTime = Date.now();
    }

    /**
     * Send a chat message
     */
    async sendMessage(chatId: string, message: MessageResponse): Promise<void> {
        try {
            const chatMessage: ChatWebSocketMessage = {
                type: 'chat_message',
                feature: 'chat',
                messageType: 'message',
                chatId,
                userId: String(message.senderId),
                payload: message,
                metadata: {
                    priority: 'high'
                }
            };

            await this.enterpriseWebSocket.sendMessage(chatMessage);
            this.metrics.messagesSent++;
            this.metrics.lastActivity = Date.now();

            // Update cache
            await this.updateMessageCache(chatId, message);

        } catch (error) {
            this.metrics.errorCount++;
            const chatError: ChatWebSocketError = {
                type: 'message',
                message: error instanceof Error ? error.message : 'Unknown error',
                timestamp: Date.now(),
                retryable: true,
                details: error
            };
            this.eventHandlers.onError?.(chatError);
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
                type: 'typing_indicator',
                feature: 'chat',
                messageType: 'typing',
                chatId,
                userId,
                payload: { userId, isTyping },
                metadata: {
                    priority: 'low'
                }
            };

            await this.enterpriseWebSocket.sendMessage(typingMessage);
            this.metrics.typingIndicatorsSent++;
            this.metrics.lastActivity = Date.now();

            // Update local typing indicators
            this.updateLocalTypingIndicator(chatId, userId, isTyping);

        } catch (error) {
            this.metrics.errorCount++;
            const chatError: ChatWebSocketError = {
                type: 'message',
                message: error instanceof Error ? error.message : 'Unknown error',
                timestamp: Date.now(),
                retryable: true,
                details: error
            };
            this.eventHandlers.onError?.(chatError);
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
                type: 'online_status',
                feature: 'chat',
                messageType: 'online_status',
                userId,
                payload: { userId, isOnline },
                metadata: {
                    priority: 'medium'
                }
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
            const chatError: ChatWebSocketError = {
                type: 'message',
                message: error instanceof Error ? error.message : 'Unknown error',
                timestamp: Date.now(),
                retryable: true,
                details: error
            };
            this.eventHandlers.onError?.(chatError);
        }
    }

    /**
     * Update presence status
     */
    async updatePresence(userId?: string, presenceData?: Partial<PresenceData>): Promise<void> {
        if (!this.config.enablePresenceManagement) {
            return;
        }

        try {
            const currentUserId = userId || 'current_user'; // Should come from auth context
            const presence: PresenceData = {
                userId: currentUserId as ResId,
                chatId: undefined,
                status: 'online',
                lastActivity: Date.now(),
                currentChat: undefined,
                isTyping: false,
                ...presenceData
            };

            const presenceMessage: ChatWebSocketMessage = {
                type: 'presence_update',
                feature: 'chat',
                messageType: 'presence',
                userId: currentUserId,
                payload: presence,
                metadata: {
                    priority: 'medium'
                }
            };

            await this.enterpriseWebSocket.sendMessage(presenceMessage);
            this.metrics.presenceUpdates++;
            this.metrics.lastActivity = Date.now();

            // Update local presence if this is current user
            if (presence.status === 'online') {
                this.onlineUsers.add(currentUserId);
            } else {
                this.onlineUsers.delete(currentUserId);
            }

        } catch (error) {
            this.metrics.errorCount++;
            const chatError: ChatWebSocketError = {
                type: 'message',
                message: error instanceof Error ? error.message : 'Unknown error',
                timestamp: Date.now(),
                retryable: true,
                details: error
            };
            this.eventHandlers.onError?.(chatError);
        }
    }

    /**
     * Delete a chat message
     */
    async deleteMessage(messageId: ResId, chatId: string): Promise<void> {
        try {
            const deleteMessage: ChatWebSocketMessage = {
                type: 'delete_message',
                feature: 'chat',
                messageType: 'chat_event',
                chatId,
                payload: { messageId, chatId },
                metadata: {
                    priority: 'high'
                }
            };

            await this.enterpriseWebSocket.sendMessage(deleteMessage);
            this.metrics.lastActivity = Date.now();

        } catch (error) {
            this.metrics.errorCount++;
            const chatError: ChatWebSocketError = {
                type: 'message',
                message: error instanceof Error ? error.message : 'Unknown error',
                timestamp: Date.now(),
                retryable: true,
                details: error
            };
            this.eventHandlers.onError?.(chatError);
            throw error;
        }
    }

    /**
     * Mark message as seen
     */
    async markMessageAsSeen(messageId: ResId, chatId: string): Promise<void> {
        try {
            const seenMessage: ChatWebSocketMessage = {
                type: 'seen_message',
                feature: 'chat',
                messageType: 'chat_event',
                chatId,
                payload: { messageId, chatId },
                metadata: {
                    priority: 'medium'
                }
            };

            await this.enterpriseWebSocket.sendMessage(seenMessage);
            this.metrics.lastActivity = Date.now();

        } catch (error) {
            this.metrics.errorCount++;
            const chatError: ChatWebSocketError = {
                type: 'message',
                message: error instanceof Error ? error.message : 'Unknown error',
                timestamp: Date.now(),
                retryable: true,
                details: error
            };
            this.eventHandlers.onError?.(chatError);
            throw error;
        }
    }

    /**
     * Subscribe to chat messages
     */
    subscribeToMessages(chatId: string, callback: (message: MessageResponse) => void): () => void {
        const handler: MessageHandler = async (message: WebSocketMessage) => {
            const chatMessage = message as unknown as ChatWebSocketMessage;
            if (chatMessage.feature === 'chat' &&
                chatMessage.messageType === 'message' &&
                chatMessage.chatId === chatId) {
                this.metrics.messagesReceived++;
                this.metrics.lastActivity = Date.now();
                callback(message.payload as MessageResponse);
            }
        };

        const route: MessageRoute = {
            feature: 'chat',
            messageType: 'message',
            handler,
            priority: 1,
            enabled: true
        };

        this.messageRouter.registerRoute(route);

        // Return unsubscribe function
        return () => {
            this.messageRouter.unregisterRoute('chat', 'message');
        };
    }

    /**
     * Subscribe to typing indicators
     */
    subscribeToTypingIndicators(chatId: string, callback: (userIds: string[]) => void): () => void {
        const handler: MessageHandler = async (message: WebSocketMessage) => {
            const chatMessage = message as unknown as ChatWebSocketMessage;
            if (chatMessage.feature === 'chat' &&
                chatMessage.messageType === 'typing' &&
                chatMessage.chatId === chatId) {
                this.metrics.typingIndicatorsReceived++;
                this.metrics.lastActivity = Date.now();

                const { userId, isTyping } = message.payload;
                this.updateLocalTypingIndicator(chatId, userId, isTyping);
                callback(Array.from(this.typingIndicators.get(chatId) || []));
            }
        };

        const route: MessageRoute = {
            feature: 'chat',
            messageType: 'typing',
            handler,
            priority: 2,
            enabled: true
        };

        this.messageRouter.registerRoute(route);

        return () => {
            this.messageRouter.unregisterRoute('chat', 'typing');
        };
    }

    /**
     * Subscribe to online status updates
     */
    subscribeToOnlineStatus(callback: (userId: string, isOnline: boolean) => void): () => void {
        const handler: MessageHandler = async (message: WebSocketMessage) => {
            const chatMessage = message as unknown as ChatWebSocketMessage;
            if (chatMessage.feature === 'chat' && chatMessage.messageType === 'online_status') {
                this.metrics.onlineStatusUpdates++;
                this.metrics.lastActivity = Date.now();

                const { userId, isOnline } = message.payload;
                if (isOnline) {
                    this.onlineUsers.add(userId);
                } else {
                    this.onlineUsers.delete(userId);
                }

                callback(userId, isOnline);
            }
        };

        const route: MessageRoute = {
            feature: 'chat',
            messageType: 'online_status',
            handler,
            priority: 3,
            enabled: true
        };

        this.messageRouter.registerRoute(route);

        return () => {
            this.messageRouter.unregisterRoute('chat', 'online_status');
        };
    }

    /**
     * Subscribe to presence updates
     */
    subscribeToPresence(callback: (presence: PresenceData) => void): () => void {
        const handler: MessageHandler = async (message: WebSocketMessage) => {
            const chatMessage = message as unknown as ChatWebSocketMessage;
            if (chatMessage.feature === 'chat' && chatMessage.messageType === 'presence') {
                this.metrics.presenceUpdates++;
                this.metrics.lastActivity = Date.now();
                callback(message.payload as PresenceData);
            }
        };

        const route: MessageRoute = {
            feature: 'chat',
            messageType: 'presence',
            handler,
            priority: 3,
            enabled: true
        };

        this.messageRouter.registerRoute(route);

        return () => {
            this.messageRouter.unregisterRoute('chat', 'presence');
        };
    }

    /**
     * Subscribe to chat events
     */
    subscribeToChatEvents(callback: (event: ChatEvent) => void): () => void {
        const handler: MessageHandler = async (message: WebSocketMessage) => {
            const chatMessage = message as unknown as ChatWebSocketMessage;
            if (chatMessage.feature === 'chat' && chatMessage.messageType === 'chat_event') {
                this.metrics.lastActivity = Date.now();
                callback(message.payload as ChatEvent);
            }
        };

        const route: MessageRoute = {
            feature: 'chat',
            messageType: 'chat_event',
            handler,
            priority: 1,
            enabled: true
        };

        this.messageRouter.registerRoute(route);

        return () => {
            this.messageRouter.unregisterRoute('chat', 'chat_event');
        };
    }

    /**
     * Get current connection status
     */
    get isConnected(): boolean {
        return this.enterpriseWebSocket.isConnected();
    }

    /**
     * Get connection state
     */
    get connectionState(): 'connecting' | 'connected' | 'disconnected' | 'reconnecting' {
        const state = this.enterpriseWebSocket.getConnectionState();
        // Filter out 'error' state as it's not supported by our return type
        return state === 'error' ? 'disconnected' : state;
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
        // Unsubscribe from all enterprise WebSocket events
        this.unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
        this.unsubscribeFunctions = [];

        // Clear local state
        this.typingIndicators.clear();
        this.onlineUsers.clear();
        this.messageDeliveryCallbacks.clear();
        this.eventHandlers = {};

        // Unregister all routes
        const messageTypes = ['message', 'typing', 'online_status', 'presence', 'chat_event'];
        messageTypes.forEach(messageType => {
            this.messageRouter.unregisterRoute('chat', messageType);
        });

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
            enableMessageReactions: false,
            enableMessageEditing: false,
            enableMessageDeletion: true,
            typingIndicatorTimeout: 3000,
            onlineStatusHeartbeat: 30000,
            presenceUpdateInterval: 60000,
            maxMessageRetries: 3,
            messageValidationRules: {
                maxMessageLength: 4000,
                maxFileSize: 10485760, // 10MB
                allowedFileTypes: ['image/*', 'application/pdf'],
                forbiddenWords: [],
                maxMentions: 10,
                maxLinks: 5,
                enableContentFiltering: false
            },
            spamDetection: {
                enabled: false,
                maxMessagesPerMinute: 30,
                maxSimilarMessages: 5,
                checkRepetitiveCharacters: false,
                checkExcessiveCaps: false,
                checkExcessiveLinks: false,
                blockSuspiciousUsers: false
            }
        };
    }

    /**
     * Get default metrics
     */
    private getDefaultMetrics(): ChatAdapterMetrics {
        return {
            messagesSent: 0,
            messagesReceived: 0,
            messagesDelivered: 0,
            messagesRead: 0,
            messagesFailed: 0,
            typingIndicatorsSent: 0,
            typingIndicatorsReceived: 0,
            typingIndicatorTimeouts: 0,
            onlineStatusUpdates: 0,
            presenceUpdates: 0,
            userJoins: 0,
            userLeaves: 0,
            connectionUptime: 0,
            reconnectionAttempts: 0,
            connectionErrors: 0,
            averageMessageLatency: 0,
            messageSuccessRate: 0,
            cacheHitRate: 0,
            errorCount: 0,
            validationErrors: 0,
            spamBlocked: 0,
            lastActivity: Date.now(),
            activeUsers: 0,
            activeChats: 0
        };
    }

    /**
     * Subscribe to enterprise WebSocket events
     */
    private subscribeToEnterpriseWebSocket(): void {
        // Subscribe to chat messages
        const unsubscribeMessages = this.enterpriseWebSocket.subscribe('chat', {
            onMessage: (message: WebSocketMessage) => {
                // Route message through the message router
                this.messageRouter.routeMessage(message);
            },
            onConnect: () => {
                this.eventHandlers.onConnectionChange?.(true);
            },
            onDisconnect: () => {
                this.eventHandlers.onConnectionChange?.(false);
            },
            onError: (error: Event) => {
                const chatError: ChatWebSocketError = {
                    type: 'connection',
                    message: 'WebSocket connection error',
                    timestamp: Date.now(),
                    retryable: true,
                    details: error
                };
                this.eventHandlers.onError?.(chatError);
            }
        });

        this.unsubscribeFunctions.push(unsubscribeMessages);
    }

    /**
     * Register message handlers with enterprise router
     */
    private async registerMessageHandlers(): Promise<void> {
        // These routes will be used by the message router to handle incoming messages
        // The actual subscription is handled in subscribeToEnterpriseWebSocket()
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
