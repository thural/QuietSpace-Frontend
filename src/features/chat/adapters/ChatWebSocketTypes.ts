/**
 * Chat WebSocket Types
 * 
 * Type definitions specific to chat WebSocket functionality.
 * Extends enterprise WebSocket types with chat-specific features.
 */

import { WebSocketMessage, WebSocketFeatureConfig } from '@/core/websocket/types';
import { MessageResponse, ChatEvent } from '../models/chat';
import { ResId } from '@/shared/api/models/common';

// Chat-specific WebSocket message types
export interface ChatWebSocketMessage extends WebSocketMessage {
  feature: 'chat';
  messageType: 'message' | 'typing' | 'online_status' | 'presence' | 'chat_event' | 'delivery_confirmation';
  chatId?: string;
  userId?: string;
  data: any;
}

// Chat message types
export interface ChatMessageData {
  id: ResId;
  chatId: ResId;
  senderId: ResId;
  content: string;
  timestamp: number;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: {
    edited?: boolean;
    editedAt?: number;
    replyTo?: ResId;
    attachments?: string[];
    mentions?: string[];
    reactions?: MessageReaction[];
    priority?: 'low' | 'normal' | 'high' | 'urgent';
  };
}

// Message reaction
export interface MessageReaction {
  emoji: string;
  userId: ResId;
  timestamp: number;
}

// Typing indicator data
export interface TypingIndicatorData {
  userId: ResId;
  chatId: ResId;
  isTyping: boolean;
  timestamp: number;
  timeout?: number;
}

// Online status data
export interface OnlineStatusData {
  userId: ResId;
  isOnline: boolean;
  lastSeen?: number;
  status?: 'online' | 'away' | 'busy' | 'invisible';
  device?: 'web' | 'mobile' | 'desktop';
}

// Presence data
export interface PresenceData {
  userId: ResId;
  chatId?: ResId;
  status: 'online' | 'away' | 'busy' | 'invisible';
  lastActivity: number;
  currentChat?: ResId;
  isTyping?: boolean;
}

// Message delivery confirmation
export interface MessageDeliveryConfirmation {
  messageId: ResId;
  chatId: ResId;
  userId: ResId;
  delivered: boolean;
  read?: boolean;
  timestamp: number;
  error?: string;
}

// Chat event data
export interface ChatEventData {
  type: 'CONNECT' | 'DISCONNECT' | 'DELETE_MESSAGE' | 'SEEN_MESSAGE' | 'LEFT_CHAT' | 'EXCEPTION' | 'USER_JOINED' | 'USER_LEFT';
  chatId?: ResId;
  userId?: ResId;
  messageId?: ResId;
  data?: any;
  timestamp: number;
}

// Chat adapter configuration
export interface ChatAdapterConfig {
  enableTypingIndicators: boolean;
  enableOnlineStatus: boolean;
  enablePresenceManagement: boolean;
  enableMessageDeliveryConfirmation: boolean;
  enableMessageReactions: boolean;
  enableMessageEditing: boolean;
  enableMessageDeletion: boolean;
  typingIndicatorTimeout: number;
  onlineStatusHeartbeat: number;
  presenceUpdateInterval: number;
  maxMessageRetries: number;
  messageValidationRules: MessageValidationRules;
  spamDetection: SpamDetectionConfig;
}

// Message validation rules
export interface MessageValidationRules {
  maxMessageLength: number;
  maxFileSize: number;
  allowedFileTypes: string[];
  forbiddenWords: string[];
  maxMentions: number;
  maxLinks: number;
  enableContentFiltering: boolean;
}

// Spam detection configuration
export interface SpamDetectionConfig {
  enabled: boolean;
  maxMessagesPerMinute: number;
  maxSimilarMessages: number;
  checkRepetitiveCharacters: boolean;
  checkExcessiveCaps: boolean;
  checkExcessiveLinks: boolean;
  blockSuspiciousUsers: boolean;
}

// Chat adapter metrics
export interface ChatAdapterMetrics {
  // Message metrics
  messagesSent: number;
  messagesReceived: number;
  messagesDelivered: number;
  messagesRead: number;
  messagesFailed: number;
  
  // Typing indicators
  typingIndicatorsSent: number;
  typingIndicatorsReceived: number;
  typingIndicatorTimeouts: number;
  
  // Online status
  onlineStatusUpdates: number;
  presenceUpdates: number;
  userJoins: number;
  userLeaves: number;
  
  // Connection metrics
  connectionUptime: number;
  reconnectionAttempts: number;
  connectionErrors: number;
  
  // Performance metrics
  averageMessageLatency: number;
  messageSuccessRate: number;
  cacheHitRate: number;
  
  // Error metrics
  errorCount: number;
  validationErrors: number;
  spamBlocked: number;
  
  // Activity metrics
  lastActivity: number;
  activeUsers: number;
  activeChats: number;
}

// Chat event handlers
export interface ChatEventHandlers {
  onMessage?: (message: MessageResponse) => void;
  onMessageEdited?: (message: MessageResponse) => void;
  onMessageDeleted?: (messageId: ResId, chatId: ResId) => void;
  onMessageDelivered?: (confirmation: MessageDeliveryConfirmation) => void;
  onMessageRead?: (messageId: ResId, chatId: ResId, userId: ResId) => void;
  onTypingIndicator?: (chatId: ResId, userIds: ResId[]) => void;
  onOnlineStatus?: (userId: ResId, isOnline: boolean) => void;
  onPresenceUpdate?: (presence: PresenceData) => void;
  onChatEvent?: (event: ChatEvent) => void;
  onError?: (error: ChatWebSocketError) => void;
  onConnectionChange?: (isConnected: boolean) => void;
  onUserJoined?: (userId: ResId, chatId: ResId) => void;
  onUserLeft?: (userId: ResId, chatId: ResId) => void;
}

// Chat WebSocket error
export interface ChatWebSocketError {
  type: 'connection' | 'message' | 'validation' | 'spam' | 'permission' | 'rate_limit';
  message: string;
  code?: string;
  details?: any;
  timestamp: number;
  retryable: boolean;
}

// Chat subscription options
export interface ChatSubscriptionOptions {
  includeHistory?: boolean;
  historyLimit?: number;
  includeTypingIndicators?: boolean;
  includeOnlineStatus?: boolean;
  includePresence?: boolean;
  includeDeliveryConfirmations?: boolean;
  messageTypes?: string[];
  priority?: 'low' | 'normal' | 'high';
}

// Chat message queue
export interface ChatMessageQueue {
  pending: QueuedMessage[];
  sent: QueuedMessage[];
  failed: QueuedMessage[];
  maxRetries: number;
  retryDelay: number;
}

// Queued message
export interface QueuedMessage {
  id: string;
  message: ChatWebSocketMessage;
  timestamp: number;
  retries: number;
  lastRetry?: number;
  error?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

// Chat cache keys
export interface ChatCacheKeys {
  messages: (chatId: ResId) => string;
  typingIndicators: (chatId: ResId) => string;
  onlineStatus: (userId: ResId) => string;
  presence: (userId: ResId) => string;
  unreadCount: (userId: ResId) => string;
  chatList: (userId: ResId) => string;
  userChats: (userId: ResId) => string;
  messageReactions: (messageId: ResId) => string;
  deliveryConfirmations: (messageId: ResId) => string;
}

// Chat WebSocket feature configuration
export interface ChatWebSocketFeatureConfig extends WebSocketFeatureConfig {
  adapter: ChatAdapterConfig;
  cacheKeys: ChatCacheKeys;
  eventHandlers: ChatEventHandlers;
  subscriptionOptions: ChatSubscriptionOptions;
}

// Chat WebSocket adapter interface
export interface IChatWebSocketAdapter {
  // Initialization
  initialize(config?: Partial<ChatAdapterConfig>): Promise<void>;
  cleanup(): Promise<void>;
  
  // Connection management
  get isConnected(): boolean;
  get connectionState(): 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
  
  // Message operations
  sendMessage(chatId: ResId, message: MessageResponse): Promise<void>;
  editMessage(messageId: ResId, content: string): Promise<void>;
  deleteMessage(messageId: ResId, chatId: ResId): Promise<void>;
  markMessageAsSeen(messageId: ResId, chatId: ResId): Promise<void>;
  addReaction(messageId: ResId, emoji: string): Promise<void>;
  removeReaction(messageId: ResId, emoji: string): Promise<void>;
  
  // Real-time features
  sendTypingIndicator(chatId: ResId, userId: ResId, isTyping: boolean): Promise<void>;
  sendOnlineStatus(userId: ResId, isOnline: boolean): Promise<void>;
  updatePresence(presence: PresenceData): Promise<void>;
  
  // Subscriptions
  subscribeToMessages(chatId: ResId, callback: (message: MessageResponse) => void, options?: ChatSubscriptionOptions): () => void;
  subscribeToTypingIndicators(chatId: ResId, callback: (userIds: ResId[]) => void): () => void;
  subscribeToOnlineStatus(callback: (userId: ResId, isOnline: boolean) => void): () => void;
  subscribeToPresence(callback: (presence: PresenceData) => void): () => void;
  subscribeToChatEvents(callback: (event: ChatEvent) => void): () => void;
  subscribeToDeliveryConfirmations(callback: (confirmation: MessageDeliveryConfirmation) => void): () => void;
  
  // Event handlers
  setEventHandlers(handlers: ChatEventHandlers): void;
  
  // Metrics and monitoring
  getMetrics(): ChatAdapterMetrics;
  getTypingIndicators(chatId: ResId): ResId[];
  getOnlineUsers(): ResId[];
  getPresence(userId: ResId): PresenceData | undefined;
  
  // Cache management
  invalidateChatCache(chatId: ResId): Promise<void>;
  invalidateUserCache(userId: ResId): Promise<void>;
  clearCache(): Promise<void>;
}

// Chat WebSocket factory
export interface IChatWebSocketFactory {
  createAdapter(config?: Partial<ChatAdapterConfig>): Promise<IChatWebSocketAdapter>;
  getDefaultConfig(): ChatAdapterConfig;
  validateConfig(config: ChatAdapterConfig): boolean;
}

// Type guards
export function isChatWebSocketMessage(message: WebSocketMessage): message is ChatWebSocketMessage {
  return message.feature === 'chat';
}

export function isChatMessageData(data: any): data is ChatMessageData {
  return data && 
         typeof data.id === 'string' &&
         typeof data.chatId === 'string' &&
         typeof data.senderId === 'string' &&
         typeof data.content === 'string' &&
         typeof data.timestamp === 'number';
}

export function isTypingIndicatorData(data: any): data is TypingIndicatorData {
  return data &&
         typeof data.userId === 'string' &&
         typeof data.chatId === 'string' &&
         typeof data.isTyping === 'boolean' &&
         typeof data.timestamp === 'number';
}

export function isOnlineStatusData(data: any): data is OnlineStatusData {
  return data &&
         typeof data.userId === 'string' &&
         typeof data.isOnline === 'boolean' &&
         typeof data.timestamp === 'number';
}

export function isPresenceData(data: any): data is PresenceData {
  return data &&
         typeof data.userId === 'string' &&
         typeof data.status === 'string' &&
         typeof data.lastActivity === 'number';
}

export function isMessageDeliveryConfirmation(data: any): data is MessageDeliveryConfirmation {
  return data &&
         typeof data.messageId === 'string' &&
         typeof data.chatId === 'string' &&
         typeof data.userId === 'string' &&
         typeof data.delivered === 'boolean' &&
         typeof data.timestamp === 'number';
}

export function isChatEventData(data: any): data is ChatEventData {
  return data &&
         typeof data.type === 'string' &&
         typeof data.timestamp === 'number';
}

export function isChatWebSocketError(error: any): error is ChatWebSocketError {
  return error &&
         typeof error.type === 'string' &&
         typeof error.message === 'string' &&
         typeof error.timestamp === 'number' &&
         typeof error.retryable === 'boolean';
}
