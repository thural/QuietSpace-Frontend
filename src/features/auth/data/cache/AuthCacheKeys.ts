/**
 * Auth Feature Cache Keys
 * 
 * Centralized cache key factory for authentication-related data
 * Follows enterprise caching patterns with security-conscious TTL strategies
 */

export const AUTH_CACHE_KEYS = {
  // User authentication data
  USER_AUTH: (userId: string) => `auth:user:${userId}`,
  USER_SESSION: (sessionId: string) => `auth:session:${sessionId}`,
  USER_TOKENS: (userId: string) => `auth:tokens:${userId}`,
  
  // Permissions and roles
  USER_PERMISSIONS: (userId: string) => `auth:permissions:${userId}`,
  USER_ROLES: (userId: string) => `auth:roles:${userId}`,
  
  // Security monitoring
  SECURITY_MONITOR: (userId: string) => `auth:security:${userId}`,
  LOGIN_ATTEMPTS: (email: string) => `auth:attempts:${email}`,
  SECURITY_EVENTS: (userId: string) => `auth:events:${userId}`,
  
  // Session management
  ACTIVE_SESSIONS: (userId: string) => `auth:sessions:${userId}`,
  SESSION_HISTORY: (userId: string) => `auth:history:${userId}`,
  
  // User profile and preferences
  USER_PROFILE: (userId: string) => `auth:profile:${userId}`,
  USER_PREFERENCES: (userId: string) => `auth:preferences:${userId}`,
  USER_SETTINGS: (userId: string) => `auth:settings:${userId}`,
  
  // Device management
  USER_DEVICES: (userId: string) => `auth:devices:${userId}`,
  DEVICE_TRUST: (deviceId: string) => `auth:device:${deviceId}`,
  
  // Two-factor authentication
  TWO_FACTOR_STATUS: (userId: string) => `auth:2fa:${userId}`,
  TWO_FACTOR_BACKUP: (userId: string) => `auth:2fa_backup:${userId}`,
  
  // Collections and lists
  ALL_USERS: () => `auth:users:all`,
  ACTIVE_USERS: () => `auth:users:active`,
  INACTIVE_USERS: () => `auth:users:inactive`,
  
  // Rate limiting and security
  RATE_LIMIT: (identifier: string, action: string) => `auth:rate:${identifier}:${action}`,
  SECURITY_FLAGS: (userId: string) => `auth:flags:${userId}`,
  
  // Audit and logging
  AUDIT_LOG: (userId: string) => `auth:audit:${userId}`,
  ACTIVITY_LOG: (userId: string) => `auth:activity:${userId}`,
  
  // Cache invalidation patterns
  INVALIDATE_USER: (userId: string) => `auth:user:${userId}*`,
  INVALIDATE_SESSIONS: (userId: string) => `auth:sessions:${userId}*`,
  INVALIDATE_SECURITY: (userId: string) => `auth:security:${userId}*`,
  INVALIDATE_ALL_USER: (userId: string) => `auth:*:${userId}*`,
  
  // System-wide caches
  SYSTEM_CONFIG: () => `auth:system:config`,
  SECURITY_POLICIES: () => `auth:system:policies`,
  RATE_LIMIT_CONFIG: () => `auth:system:rate_limits`
} as const;

/**
 * Cache TTL mappings for auth data
 * Security-conscious TTL values for different types of auth data
 */
export const AUTH_CACHE_TTL = {
  // Short TTL for security-sensitive data
  USER_AUTH: 5 * 60 * 1000, // 5 minutes
  USER_TOKENS: 2 * 60 * 1000, // 2 minutes
  USER_SESSION: 10 * 60 * 1000, // 10 minutes
  
  // Medium TTL for user data
  USER_PROFILE: 30 * 60 * 1000, // 30 minutes
  USER_PERMISSIONS: 15 * 60 * 1000, // 15 minutes
  USER_ROLES: 15 * 60 * 1000, // 15 minutes
  
  // Longer TTL for static data
  USER_SETTINGS: 60 * 60 * 1000, // 1 hour
  USER_PREFERENCES: 60 * 60 * 1000, // 1 hour
  
  // Security monitoring (short TTL for real-time detection)
  SECURITY_MONITOR: 1 * 60 * 1000, // 1 minute
  LOGIN_ATTEMPTS: 5 * 60 * 1000, // 5 minutes
  SECURITY_EVENTS: 2 * 60 * 1000, // 2 minutes
  
  // Device management
  USER_DEVICES: 30 * 60 * 1000, // 30 minutes
  DEVICE_TRUST: 60 * 60 * 1000, // 1 hour
  
  // Two-factor authentication
  TWO_FACTOR_STATUS: 5 * 60 * 1000, // 5 minutes
  TWO_FACTOR_BACKUP: 60 * 60 * 1000, // 1 hour
  
  // Rate limiting (very short TTL)
  RATE_LIMIT: 30 * 1000, // 30 seconds
  SECURITY_FLAGS: 1 * 60 * 1000, // 1 minute
  
  // Audit logs (longer retention)
  AUDIT_LOG: 24 * 60 * 60 * 1000, // 24 hours
  ACTIVITY_LOG: 12 * 60 * 60 * 1000, // 12 hours
  
  // System configuration
  SYSTEM_CONFIG: 24 * 60 * 60 * 1000, // 24 hours
  SECURITY_POLICIES: 24 * 60 * 60 * 1000, // 24 hours
  RATE_LIMIT_CONFIG: 24 * 60 * 60 * 1000 // 24 hours
} as const;

/**
 * Cache invalidation helpers
 */
export const AUTH_CACHE_INVALIDATION = {
  // Invalidate all user-related caches
  invalidateUser: (userId: string) => [
    AUTH_CACHE_KEYS.INVALIDATE_USER(userId),
    AUTH_CACHE_KEYS.INVALIDATE_SESSIONS(userId),
    AUTH_CACHE_KEYS.INVALIDATE_SECURITY(userId)
  ],
  
  // Invalidate security-related caches
  invalidateSecurity: (userId: string) => [
    AUTH_CACHE_KEYS.SECURITY_MONITOR(userId),
    AUTH_CACHE_KEYS.LOGIN_ATTEMPTS(''), // Will be pattern matched
    AUTH_CACHE_KEYS.SECURITY_EVENTS(userId),
    AUTH_CACHE_KEYS.SECURITY_FLAGS(userId)
  ],
  
  // Invalidate session-related caches
  invalidateSessions: (userId: string) => [
    AUTH_CACHE_KEYS.USER_SESSION(''), // Will be pattern matched
    AUTH_CACHE_KEYS.ACTIVE_SESSIONS(userId),
    AUTH_CACHE_KEYS.SESSION_HISTORY(userId)
  ],
  
  // Invalidate all auth data for user
  invalidateAllUser: (userId: string) => [
    AUTH_CACHE_KEYS.INVALIDATE_ALL_USER(userId)
  ]
} as const;
