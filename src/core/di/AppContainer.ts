import 'reflect-metadata';
import { createContainer } from '../di';
import { createLogger } from '../services';
import { createTheme } from '../theme';
import { EnterpriseAuthService } from '../auth';
import { createCacheProvider, createCacheServiceManager, type ICacheProvider, type ICacheServiceManager } from '../cache';
import { TYPES } from './types';
import { apiClient } from '../network/rest/apiClient';
// import { registerFeedContainer } from '../../../features/feed/di/container';
// import { registerChatContainer } from '../../../features/chat/di/container';
// import { createSearchContainer } from '../../../features/search/di/container';
// import { registerWebSocketServices, initializeWebSocketServices } from '../websocket/di/WebSocketContainer';
import type { AxiosInstance } from 'axios';

// Import repositories (commented out until feature modules are created)
// import { AuthRepository } from '../../../features/auth/data/repositories/AuthRepository';
// import { ChatRepository } from '../../../features/chat/data/repositories/ChatRepository';
// import { MessageRepository } from '../../../features/chat/data/repositories/MessageRepository';
// import { PostRepository } from '../../../features/feed/data/repositories/PostRepository';
// import { CommentRepository } from '../../../features/feed/data/repositories/CommentRepository';
// import { NotificationRepository } from '../../../features/notification/data/repositories/NotificationRepository';
// import { UserRepository } from '../../../features/search/data/repositories/UserRepository';
// import { SearchRepositoryImpl } from '../../../features/search/data/repositories/SearchRepositoryImpl';

/**
 * Application DI Container Setup.
 * 
 * Configures and initializes the dependency injection container
 * with all application services.
 */

export function createAppContainer() {
  console.log('🏗️ Setting up application DI container...');

  const container = createContainer();

  // Register core services using factory functions
  const loggerService = createLogger();
  const themeService = createTheme();
  container.registerInstance('LoggerService', loggerService);
  container.registerInstance('ThemeService', themeService);

  // Register cache services using factory functions
  const cacheServiceManager = createCacheServiceManager();
  const cacheProvider = createCacheProvider();
  container.registerInstance('CacheServiceManager', cacheServiceManager);
  container.registerInstance('CacheProvider', cacheProvider);
  container.registerInstanceByToken(TYPES.CACHE_SERVICE, cacheServiceManager);

  // Register API client and repositories
  container.registerInstanceByToken(TYPES.API_CLIENT, apiClient);

  // Register repositories (commented out until feature modules are created)
  /*
  container.registerSingleton(AuthRepository);
  container.registerSingleton(ChatRepository);
  container.registerSingleton(MessageRepository);
  container.registerSingleton(PostRepository);
  container.registerSingleton(CommentRepository);
  container.registerSingleton(NotificationRepository);
  container.registerSingleton(UserRepository);
  container.registerSingleton(SearchRepositoryImpl);

  // Register repositories by token for injection
  container.registerSingletonByToken(TYPES.AUTH_REPOSITORY, AuthRepository);
  container.registerSingletonByToken(TYPES.CHAT_REPOSITORY, ChatRepository);
  container.registerSingletonByToken(TYPES.MESSAGE_REPOSITORY, MessageRepository);
  container.registerSingletonByToken(TYPES.POST_REPOSITORY, PostRepository);
  container.registerSingletonByToken(TYPES.COMMENT_REPOSITORY, CommentRepository);
  container.registerSingletonByToken(TYPES.NOTIFICATION_REPOSITORY, NotificationRepository);
  container.registerSingletonByToken(TYPES.USER_REPOSITORY, UserRepository);
  container.registerSingletonByToken(TYPES.SEARCH_REPOSITORY, SearchRepositoryImpl);
  */

  // Register enterprise auth service
  const enterpriseAuthService = new EnterpriseAuthService(null as any, null as any, null as any, null as any, null as any);
  container.registerInstance(EnterpriseAuthService, enterpriseAuthService);

  // Auth adapter is now handled by the auth service itself

  // Example of using typed string tokens for registration
  // This provides type safety - only valid TYPES values are allowed
  container.registerInstanceByToken(TYPES.AUTH_SERVICE, enterpriseAuthService);

  // Feature containers (commented out until feature modules are created)
  // const feedContainer = registerFeedContainer(container);
  // registerChatContainer(container);
  // const searchContainer = createSearchContainer();

  // WebSocket enterprise services (commented out until module is created)
  // const webSocketContainer = registerWebSocketServices(container);

  console.log('✅ Core services registered');
  // console.log('✅ Feed feature container registered');
  // console.log('✅ Chat feature services registered');
  // console.log('✅ Search feature container registered');
  // console.log('✅ WebSocket enterprise services registered');
  console.log(`📊 Container stats: ${JSON.stringify(container.getStats())}`);

  return container;
}

/**
 * Initialize application with DI
 */
export async function initializeApp() {
  const container = createAppContainer();

  // Initialize services
  const themeService = container.get('ThemeService') as any;
  if (themeService && typeof themeService.setTheme === 'function') {
    themeService.setTheme('light');
  }

  // Example of using typed string tokens for retrieval
  // This provides type safety - only valid TYPES values are allowed
  const authService: { initialize?: () => Promise<void> } = container.getByToken(TYPES.AUTH_SERVICE);
  const apiClientInstance: AxiosInstance = container.getByToken(TYPES.API_CLIENT);
  // const postRepository = container.get(PostRepository);

  // Initialize auth service if available
  if (authService && 'initialize' in authService && typeof authService.initialize === 'function') {
    (authService as any).initialize().catch(console.error);
  }

  // Example: Demonstrate API client usage
  console.log('🔗 API client configured with baseURL:', apiClient.defaults.baseURL);
  // console.log('📄 Post repository initialized with DI');

  // Example: Demonstrate feed feature service usage
  const feedFeatureService = container.getByToken(TYPES.FEED_FEATURE_SERVICE);
  const postFeatureService = container.getByToken(TYPES.POST_FEATURE_SERVICE);
  console.log('📱 Feed feature services initialized and ready');

  // Example: Demonstrate search feature service usage
  const searchFeatureService = container.getByToken(TYPES.SEARCH_FEATURE_SERVICE);
  console.log('🔍 Search feature services initialized and ready');

  // Initialize WebSocket services (commented out until module is created)
  // console.log('🌐 Initializing WebSocket enterprise services...');
  // await initializeWebSocketServices(container);

  console.log('🚀 Application initialized with DI');

  return container;
}
