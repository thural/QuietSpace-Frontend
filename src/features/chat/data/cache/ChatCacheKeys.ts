/**
 * Chat Feature Cache Keys
 * 
 * Centralized cache key definitions for chat-related data.
 * Follows hierarchical naming convention for efficient invalidation.
 */

export const CHAT_CACHE_KEYS = {
  // Messages
  MESSAGES: (chatId: string, page: number = 0) => `chat:${chatId}:messages:${page}`,
  MESSAGE: (messageId: string) => `chat:message:${messageId}`,
  
  // Chat metadata
  CHAT_INFO: (chatId: string) => `chat:info:${chatId}`,
  CHAT_PARTICIPANTS: (chatId: string) => `chat:participants:${chatId}`,
  
  // Real-time state
  TYPING_INDICATORS: (chatId: string) => `chat:typing:${chatId}`,
  ONLINE_STATUS: (userId: string) => `chat:online:${userId}`,
  
  // User-specific
  USER_CHATS: (userId: string) => `chat:user:${userId}:chats`,
  UNREAD_COUNT: (userId: string) => `chat:user:${userId}:unread`,
  
  // Collections
  RECENT_CHATS: (userId: string, limit: number = 20) => `chat:user:${userId}:recent:${limit}`,
  ACTIVE_CHATS: (userId: string) => `chat:user:${userId}:active`,
  
  // Chat lists and filters
  CHAT_LIST: (userId: string, filters?: string) => 
    `chat:user:${userId}:list${filters ? `:${filters}` : ''}`,
  
  // Search and pagination
  SEARCH_RESULTS: (query: string, page: number = 0) => `chat:search:${query}:page:${page}`,
  
  // Media and attachments
  MESSAGE_ATTACHMENTS: (messageId: string) => `chat:message:${messageId}:attachments`,
  
  // Chat settings and preferences
  CHAT_SETTINGS: (chatId: string) => `chat:${chatId}:settings`,
  USER_CHAT_SETTINGS: (userId: string) => `chat:user:${userId}:settings`
};

// Cache invalidation patterns for efficient bulk operations
export const CHAT_INVALIDATION_PATTERNS = {
  // All message-related caches for a chat
  CHAT_MESSAGES: (chatId: string) => `chat:${chatId}:messages*`,
  
  // All user-specific chat data
  USER_CHAT_DATA: (userId: string) => `chat:user:${userId}*`,
  
  // Specific message and its related data
  SPECIFIC_MESSAGE: (messageId: string) => `chat:message:${messageId}*`,
  
  // All typing indicators for a chat
  TYPING_INDICATORS: (chatId: string) => `chat:typing:${chatId}*`,
  
  // All online status data
  ONLINE_STATUS_ALL: `chat:online:*`,
  
  // All search results
  SEARCH_RESULTS_ALL: `chat:search:*`,
  
  // All chat lists
  CHAT_LISTS_ALL: `chat:*:list*`,
  
  // All chat settings
  CHAT_SETTINGS_ALL: `chat:*:settings*`
};

// Helper functions for cache key generation
export const ChatCacheUtils = {
  // Generate a unique key for a message in a specific chat
  messageKey: (chatId: string, messageId: string) => 
    `${CHAT_CACHE_KEYS.MESSAGES(chatId)}:${messageId}`,
  
  // Generate a key for user's chat summary
  userChatSummary: (userId: string) => 
    `${CHAT_CACHE_KEYS.USER_CHATS(userId)}:summary`,
  
  // Generate a key for pagination metadata
  paginationMeta: (chatId: string, page: number) => 
    `${CHAT_CACHE_KEYS.MESSAGES(chatId, page)}:meta`,
  
  // Generate a key for real-time state
  realtimeState: (chatId: string) => 
    `chat:${chatId}:realtime`,
  
  // Validate cache key format
  isValidKey: (key: string): boolean => {
    return /^chat:([a-zA-Z0-9_-]+):([a-zA-Z0-9_-]+)(:([a-zA-Z0-9_-]+))?$/.test(key);
  },
  
  // Extract chat ID from cache key
  extractChatId: (key: string): string | null => {
    const match = key.match(/^chat:([a-zA-Z0-9_-]+):/);
    return match ? match[1] : null;
  },
  
  // Extract user ID from cache key
  extractUserId: (key: string): string | null => {
    const match = key.match(/^chat:user:([a-zA-Z0-9_-]+):/);
    return match ? match[1] : null;
  }
};
