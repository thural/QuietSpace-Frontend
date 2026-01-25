/**
 * Chat WebSocket Adapters
 * 
 * Exports all chat WebSocket adapter components and types.
 * Provides enterprise-grade WebSocket functionality for chat features.
 */

// Main adapter
export { ChatWebSocketAdapter } from './ChatWebSocketAdapter';

// Message handlers
export { ChatMessageHandlers } from './ChatMessageHandlers';

// Migration utilities
export { ChatWebSocketMigration } from './ChatWebSocketMigration';
export { 
  useChatSocketMigration,
  useChatMigrationMonitor,
  type ChatMigrationConfig,
  type ChatMigrationState,
  type UseChatSocketMigrationReturn
} from './ChatSocketMigration';

// Types and interfaces
export {
  // Core types
  type ChatWebSocketMessage,
  type ChatMessageData,
  type MessageReaction,
  type TypingIndicatorData,
  type OnlineStatusData,
  type PresenceData,
  type MessageDeliveryConfirmation,
  type ChatEventData,
  
  // Configuration
  type ChatAdapterConfig,
  type MessageValidationRules,
  type SpamDetectionConfig,
  
  // Metrics and monitoring
  type ChatAdapterMetrics,
  type ChatWebSocketError,
  
  // Event handlers
  type ChatEventHandlers,
  
  // Subscriptions
  type ChatSubscriptionOptions,
  type ChatMessageQueue,
  type QueuedMessage,
  
  // Cache
  type ChatCacheKeys,
  
  // Feature configuration
  type ChatWebSocketFeatureConfig,
  
  // Interfaces
  type IChatWebSocketAdapter,
  type IChatWebSocketFactory,
  
  // Migration types
  type ChatMigrationConfig,
  type ChatMigrationMetrics,
  type ChatMigrationStatus,
  
  // Type guards
  isChatWebSocketMessage,
  isChatMessageData,
  isTypingIndicatorData,
  isOnlineStatusData,
  isPresenceData,
  isMessageDeliveryConfirmation,
  isChatEventData,
  isChatWebSocketError
} from './ChatWebSocketTypes';

// Constants
export const CHAT_WEBSOCKET_FEATURE_NAME = 'chat';

export const DEFAULT_CHAT_ADAPTER_CONFIG = {
  enableTypingIndicators: true,
  enableOnlineStatus: true,
  enablePresenceManagement: true,
  enableMessageDeliveryConfirmation: true,
  enableMessageReactions: true,
  enableMessageEditing: true,
  enableMessageDeletion: true,
  typingIndicatorTimeout: 3000,
  onlineStatusHeartbeat: 30000,
  presenceUpdateInterval: 60000,
  maxMessageRetries: 3,
  messageValidationRules: {
    maxMessageLength: 4000,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ['image/*', 'application/pdf', 'text/*'],
    forbiddenWords: ['spam', 'abuse', 'inappropriate'],
    maxMentions: 10,
    maxLinks: 3,
    enableContentFiltering: true
  },
  spamDetection: {
    enabled: true,
    maxMessagesPerMinute: 30,
    maxSimilarMessages: 5,
    checkRepetitiveCharacters: true,
    checkExcessiveCaps: true,
    checkExcessiveLinks: true,
    blockSuspiciousUsers: false
  }
};

export const CHAT_CACHE_KEYS: ChatCacheKeys = {
  messages: (chatId: string) => `chat:${chatId}:messages`,
  typingIndicators: (chatId: string) => `chat:${chatId}:typing`,
  onlineStatus: (userId: string) => `chat:${userId}:online`,
  presence: (userId: string) => `chat:${userId}:presence`,
  unreadCount: (userId: string) => `chat:${userId}:unread`,
  chatList: (userId: string) => `chat:${userId}:chats`,
  userChats: (userId: string) => `chat:${userId}:user_chats`,
  messageReactions: (messageId: string) => `chat:message:${messageId}:reactions`,
  deliveryConfirmations: (messageId: string) => `chat:message:${messageId}:delivery`
};

export const CHAT_WEBSOCKET_EVENTS = {
  // Message events
  MESSAGE_SENT: 'chat:message:sent',
  MESSAGE_RECEIVED: 'chat:message:received',
  MESSAGE_EDITED: 'chat:message:edited',
  MESSAGE_DELETED: 'chat:message:deleted',
  MESSAGE_DELIVERED: 'chat:message:delivered',
  MESSAGE_READ: 'chat:message:read',
  MESSAGE_FAILED: 'chat:message:failed',
  
  // Typing events
  TYPING_STARTED: 'chat:typing:started',
  TYPING_STOPPED: 'chat:typing:stopped',
  TYPING_TIMEOUT: 'chat:typing:timeout',
  
  // Presence events
  USER_ONLINE: 'chat:user:online',
  USER_OFFLINE: 'chat:user:offline',
  USER_AWAY: 'chat:user:away',
  USER_BUSY: 'chat:user:busy',
  PRESENCE_UPDATED: 'chat:presence:updated',
  
  // Chat events
  USER_JOINED_CHAT: 'chat:joined',
  USER_LEFT_CHAT: 'chat:left',
  CHAT_CREATED: 'chat:created',
  CHAT_DELETED: 'chat:deleted',
  
  // Connection events
  CHAT_CONNECTED: 'chat:connected',
  CHAT_DISCONNECTED: 'chat:disconnected',
  CHAT_RECONNECTING: 'chat:reconnecting',
  CHAT_ERROR: 'chat:error',
  
  // Cache events
  CHAT_CACHE_INVALIDATED: 'chat:cache:invalidated',
  CHAT_CACHE_CLEARED: 'chat:cache:cleared'
} as const;

export const CHAT_MESSAGE_PRIORITIES = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
} as const;

export const CHAT_MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  SYSTEM: 'system',
  REACTION: 'reaction',
  EDIT: 'edit',
  DELETE: 'delete'
} as const;

export const CHAT_USER_STATUSES = {
  ONLINE: 'online',
  AWAY: 'away',
  BUSY: 'busy',
  INVISIBLE: 'invisible'
} as const;

export const CHAT_ERROR_TYPES = {
  CONNECTION: 'connection',
  MESSAGE: 'message',
  VALIDATION: 'validation',
  SPAM: 'spam',
  PERMISSION: 'permission',
  RATE_LIMIT: 'rate_limit'
} as const;

// Utility functions
export function createChatMessage(
  chatId: string,
  senderId: string,
  content: string,
  type: string = CHAT_MESSAGE_TYPES.TEXT
): ChatMessageData {
  return {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    chatId,
    senderId,
    content: content.trim(),
    timestamp: Date.now(),
    type: type as any,
    metadata: {
      edited: false,
      mentions: extractMentions(content),
      priority: CHAT_MESSAGE_PRIORITIES.NORMAL
    }
  };
}

export function createTypingIndicator(
  chatId: string,
  userId: string,
  isTyping: boolean
): TypingIndicatorData {
  return {
    userId,
    chatId,
    isTyping,
    timestamp: Date.now()
  };
}

export function createOnlineStatus(
  userId: string,
  isOnline: boolean,
  status?: string
): OnlineStatusData {
  return {
    userId,
    isOnline,
    status: (status || (isOnline ? CHAT_USER_STATUSES.ONLINE : CHAT_USER_STATUSES.OFFLINE)) as any,
    lastSeen: Date.now()
  };
}

export function createPresenceData(
  userId: string,
  status: string,
  currentChat?: string
): PresenceData {
  return {
    userId,
    status: status as any,
    lastActivity: Date.now(),
    currentChat: currentChat as any,
    isTyping: false
  };
}

export function createDeliveryConfirmation(
  messageId: string,
  chatId: string,
  userId: string,
  delivered: boolean,
  read?: boolean
): MessageDeliveryConfirmation {
  return {
    messageId,
    chatId,
    userId,
    delivered,
    read,
    timestamp: Date.now()
  };
}

export function extractMentions(content: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;
  
  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
}

export function extractLinks(content: string): string[] {
  const linkRegex = /https?:\/\/[^\s]+/g;
  const links: string[] = [];
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    links.push(match[0]);
  }
  
  return links;
}

export function sanitizeMessageContent(content: string): string {
  return content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

export function isValidMessageContent(content: string, maxLength: number = 4000): boolean {
  const sanitized = sanitizeMessageContent(content);
  return sanitized.length > 0 && sanitized.length <= maxLength;
}

export function isSpamMessage(content: string, config: SpamDetectionConfig): boolean {
  if (!config.enabled) {
    return false;
  }
  
  // Check for excessive capitalization
  if (config.checkExcessiveCaps) {
    const upperCaseRatio = (content.match(/[A-Z]/g) || []).length / content.length;
    if (upperCaseRatio > 0.7 && content.length > 10) {
      return true;
    }
  }
  
  // Check for repetitive characters
  if (config.checkRepetitiveCharacters) {
    const repetitivePattern = /(.)\1{4,}/;
    if (repetitivePattern.test(content)) {
      return true;
    }
  }
  
  // Check for excessive links
  if (config.checkExcessiveLinks) {
    const linkCount = extractLinks(content).length;
    if (linkCount > 3) {
      return true;
    }
  }
  
  return false;
}

export function getMessagePriority(content: string): string {
  // Check for urgent keywords
  const urgentKeywords = ['urgent', 'emergency', 'asap', 'immediately'];
  if (urgentKeywords.some(keyword => content.toLowerCase().includes(keyword))) {
    return CHAT_MESSAGE_PRIORITIES.HIGH;
  }
  
  // Check for important keywords
  const importantKeywords = ['important', 'note', 'attention'];
  if (importantKeywords.some(keyword => content.toLowerCase().includes(keyword))) {
    return CHAT_MESSAGE_PRIORITIES.HIGH;
  }
  
  return CHAT_MESSAGE_PRIORITIES.NORMAL;
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 60000) { // Less than 1 minute
    return 'just now';
  } else if (diff < 3600000) { // Less than 1 hour
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  } else if (diff < 86400000) { // Less than 1 day
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  }
}
