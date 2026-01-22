/**
 * Dependency Injection Types.
 * 
 * Defines all DI container types and tokens for the application.
 */

export const TYPES = {
  // Core Services
  API_CLIENT: 'ApiClient',
  SOCKET_SERVICE: 'SocketService',
  
  // Repositories
  POST_REPOSITORY: 'PostRepository',
  USER_REPOSITORY: 'UserRepository',
  
  // Services
  AUTH_SERVICE: 'AuthService',
  CACHE_SERVICE: 'CacheService',
  
  // Stores
  AUTH_STORE: 'AuthStore',
  FEED_STORE: 'FeedStore'
} as const;

export type TypeKeys = typeof TYPES[keyof typeof TYPES];

