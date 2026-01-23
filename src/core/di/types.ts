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
  AUTH_REPOSITORY: 'AuthRepository',
  CHAT_REPOSITORY: 'ChatRepository',
  MESSAGE_REPOSITORY: 'MessageRepository',
  POST_REPOSITORY: 'PostRepository',
  COMMENT_REPOSITORY: 'CommentRepository',
  NOTIFICATION_REPOSITORY: 'NotificationRepository',
  USER_REPOSITORY: 'UserRepository',
  
  // Data Services
  POST_DATA_SERVICE: 'PostDataService',
  COMMENT_DATA_SERVICE: 'CommentDataService',
  FEED_DATA_SERVICE: 'FeedDataService',
  
  // Feature Services
  FEED_FEATURE_SERVICE: 'FeedFeatureService',
  POST_FEATURE_SERVICE: 'PostFeatureService',
  
  // Configurations
  POST_DATA_SERVICE_CONFIG: 'PostDataServiceConfig',
  COMMENT_DATA_SERVICE_CONFIG: 'CommentDataServiceConfig',
  FEED_DATA_SERVICE_CONFIG: 'FeedDataServiceConfig',
  
  // Core Services
  AUTH_SERVICE: 'AuthService',
  CACHE_SERVICE: 'CacheService',
  
  // Containers
  FEED_CONTAINER: 'FeedContainer',
  
  // Stores
  AUTH_STORE: 'AuthStore',
  FEED_STORE: 'FeedStore'
} as const;

export type TypeKeys = typeof TYPES[keyof typeof TYPES];

