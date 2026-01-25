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
  IAUTH_REPOSITORY: 'IAuthRepository',
  AUTH_REPOSITORY: 'AuthRepository',
  CHAT_REPOSITORY: 'ChatRepository',
  MESSAGE_REPOSITORY: 'MessageRepository',
  POST_REPOSITORY: 'PostRepository',
  COMMENT_REPOSITORY: 'CommentRepository',
  NOTIFICATION_REPOSITORY: 'NotificationRepository',
  USER_REPOSITORY: 'UserRepository',
  PROFILE_REPOSITORY: 'ProfileRepository',
  SEARCH_REPOSITORY: 'SearchRepository',
  
  // Data Services
  AUTH_DATA_SERVICE: 'AuthDataService',
  NOTIFICATION_DATA_SERVICE: 'NotificationDataService',
  ANALYTICS_DATA_SERVICE: 'AnalyticsDataService',
  POST_DATA_SERVICE: 'PostDataService',
  COMMENT_DATA_SERVICE: 'CommentDataService',
  FEED_DATA_SERVICE: 'FeedDataService',
  PROFILE_DATA_SERVICE: 'ProfileDataService',
  SEARCH_DATA_SERVICE: 'SearchDataService',
  
  // Feature Services
  AUTH_FEATURE_SERVICE: 'AuthFeatureService',
  NOTIFICATION_FEATURE_SERVICE: 'NotificationFeatureService',
  ANALYTICS_FEATURE_SERVICE: 'AnalyticsFeatureService',
  FEED_FEATURE_SERVICE: 'FeedFeatureService',
  POST_FEATURE_SERVICE: 'PostFeatureService',
  PROFILE_FEATURE_SERVICE: 'ProfileFeatureService',
  SEARCH_FEATURE_SERVICE: 'SearchFeatureService',
  
  // Chat Feature Services
  CHAT_DATA_SERVICE: 'ChatDataService',
  CHAT_FEATURE_SERVICE: 'ChatFeatureService',
  WEBSOCKET_SERVICE: 'WebSocketService',
  ICHAT_REPOSITORY: 'IChatRepository',
  
  // WebSocket Enterprise Services
  ENTERPRISE_WEBSOCKET_SERVICE: 'EnterpriseWebSocketService',
  CONNECTION_MANAGER: 'ConnectionManager',
  MESSAGE_ROUTER: 'MessageRouter',
  WEBSOCKET_CONTAINER: 'WebSocketContainer',
  
  // Notification Feature Services
  PUSH_NOTIFICATION_SERVICE: 'PushNotificationService',
  
  // Configurations
  POST_DATA_SERVICE_CONFIG: 'PostDataServiceConfig',
  COMMENT_DATA_SERVICE_CONFIG: 'CommentDataServiceConfig',
  FEED_DATA_SERVICE_CONFIG: 'FeedDataServiceConfig',
  
  // Core Services
  AUTH_SERVICE: 'AuthService',
  CACHE_SERVICE: 'CacheService',
  
  // Containers
  AUTH_CONTAINER: 'AuthContainer',
  NOTIFICATION_CONTAINER: 'NotificationContainer',
  ANALYTICS_CONTAINER: 'AnalyticsContainer',
  FEED_CONTAINER: 'FeedContainer',
  PROFILE_CONTAINER: 'ProfileContainer',
  SEARCH_CONTAINER: 'SearchContainer',
  
  // Stores
  AUTH_STORE: 'AuthStore',
  FEED_STORE: 'FeedStore'
} as const;

export type TypeKeys = typeof TYPES[keyof typeof TYPES];

