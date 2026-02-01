/**
 * WebSocket Constants.
 *
 * Centralized constants for WebSocket operations.
 */

export const WEBSOCKET_MESSAGE_TYPES = {
  // System messages
  HEARTBEAT: 'heartbeat',
  PING: 'ping',
  PONG: 'pong',
  ERROR: 'error',

  // Chat messages
  CHAT_MESSAGE: 'message',
  CHAT_TYPING: 'typing',
  CHAT_ONLINE_STATUS: 'online_status',
  CHAT_READ_RECEIPT: 'read_receipt',

  // Notification messages
  NOTIFICATION_PUSH: 'push',
  NOTIFICATION_SEEN: 'seen',
  NOTIFICATION_DISMISSED: 'dismissed',

  // Feed messages
  FEED_UPDATE: 'update',
  FEED_CREATE: 'create',
  FEED_DELETE: 'delete',
  FEED_LIKE: 'like',
  FEED_COMMENT: 'comment',

  // Search messages
  SEARCH_QUERY: 'query',
  SEARCH_RESULTS: 'results',
  SEARCH_SUGGESTIONS: 'suggestions',

  // User messages
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
  USER_STATUS_UPDATE: 'status_update',

  // System events
  SYSTEM_MAINTENANCE: 'maintenance',
  SYSTEM_SHUTDOWN: 'shutdown',
  SYSTEM_RESTART: 'restart'
} as const;

export const WEBSOCKET_CONNECTION_STATES = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  RECONNECTING: 'reconnecting',
  ERROR: 'error'
} as const;

export const WEBSOCKET_FEATURES = {
  SYSTEM: 'system',
  CHAT: 'chat',
  NOTIFICATION: 'notification',
  FEED: 'feed',
  SEARCH: 'search',
  USER: 'user',
  ANALYTICS: 'analytics',
  ADMIN: 'admin'
} as const;

export const WEBSOCKET_EVENTS = {
  // Connection events
  CONNECTION_OPENING: 'connection:opening',
  CONNECTION_OPENED: 'connection:opened',
  CONNECTION_CLOSING: 'connection:closing',
  CONNECTION_CLOSED: 'connection:closed',
  CONNECTION_ERROR: 'connection:error',
  CONNECTION_RECONNECTING: 'connection:reconnecting',

  // Message events
  MESSAGE_SENT: 'message:sent',
  MESSAGE_RECEIVED: 'message:received',
  MESSAGE_DELIVERED: 'message:delivered',
  MESSAGE_FAILED: 'message:failed',

  // Feature events
  FEATURE_SUBSCRIBED: 'feature:subscribed',
  FEATURE_UNSUBSCRIBED: 'feature:unsubscribed',
  FEATURE_ERROR: 'feature:error',

  // Health events
  HEALTH_CHECK_PASSED: 'health:passed',
  HEALTH_CHECK_FAILED: 'health:failed',
  HEALTH_DEGRADED: 'health:degraded'
} as const;

export const WEBSOCKET_ERRORS = {
  // Connection errors
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  CONNECTION_TIMEOUT: 'CONNECTION_TIMEOUT',
  CONNECTION_REFUSED: 'CONNECTION_REFUSED',
  CONNECTION_LOST: 'CONNECTION_LOST',

  // Message errors
  MESSAGE_TOO_LARGE: 'MESSAGE_TOO_LARGE',
  MESSAGE_INVALID: 'MESSAGE_INVALID',
  MESSAGE_NOT_DELIVERED: 'MESSAGE_NOT_DELIVERED',

  // Authentication errors
  AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
  AUTHENTICATION_EXPIRED: 'AUTHENTICATION_EXPIRED',
  AUTHORIZATION_FAILED: 'AUTHORIZATION_FAILED',

  // Rate limiting errors
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  TOO_MANY_CONNECTIONS: 'TOO_MANY_CONNECTIONS',

  // Feature errors
  FEATURE_NOT_SUPPORTED: 'FEATURE_NOT_SUPPORTED',
  FEATURE_DISABLED: 'FEATURE_DISABLED',
  FEATURE_UNAVAILABLE: 'FEATURE_UNAVAILABLE',

  // System errors
  SYSTEM_OVERLOAD: 'SYSTEM_OVERLOAD',
  SYSTEM_MAINTENANCE: 'SYSTEM_MAINTENANCE',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
} as const;

export const WEBSOCKET_DEFAULT_CONFIG = {
  // Connection settings
  URL: process.env.REACT_APP_WS_URL || 'ws://localhost:3001/ws',
  RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY: 1000,
  CONNECTION_TIMEOUT: 10000,

  // Heartbeat settings
  HEARTBEAT_INTERVAL: 30000,
  HEARTBEAT_TIMEOUT: 60000,
  MAX_MISSED_HEARTBEATS: 3,

  // Message settings
  MAX_MESSAGE_SIZE: 1024 * 1024, // 1MB
  MESSAGE_TIMEOUT: 5000,

  // Pool settings
  MAX_CONNECTIONS: 10,
  HEALTH_CHECK_INTERVAL: 30000,
  LOAD_BALANCING_STRATEGY: 'priority' as const,

  // Cache settings
  CACHE_TTL: 300000, // 5 minutes
  MAX_CACHE_SIZE: 1000,
  ENABLE_CACHE_INVALIDATION: true,

  // Metrics settings
  ENABLE_METRICS: true,
  METRICS_INTERVAL: 2000,

  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  RETRY_BACKOFF_MULTIPLIER: 2
} as const;

export const WEBSOCKET_CACHE_PATTERNS = {
  // Chat cache patterns
  CHAT_MESSAGES: 'chat:*:messages',
  CHAT_CONVERSATIONS: 'chat:*:conversations',
  CHAT_ONLINE_USERS: 'chat:*:online_users',

  // Notification cache patterns
  USER_NOTIFICATIONS: 'user:*:notifications',
  NOTIFICATION_UNREAD: 'notification:*:unread',

  // Feed cache patterns
  FEED_POSTS: 'feed:*:posts',
  USER_FEED: 'user:*:feed',
  TRENDING_POSTS: 'trending:*',

  // Search cache patterns
  SEARCH_RESULTS: 'search:*:results',
  SEARCH_SUGGESTIONS: 'search:*:suggestions',

  // User cache patterns
  USER_PROFILE: 'user:*:profile',
  USER_STATUS: 'user:*:status',
  USER_ONLINE_STATUS: 'user:*:online_status'
} as const;

export const WEBSOCKET_PRIORITIES = {
  CRITICAL: 10,
  HIGH: 5,
  NORMAL: 1,
  LOW: 0
} as const;

export const WEBSOCKET_LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
} as const;
