
// Import migrated data services
import { AnalyticsDataService } from '../../features/analytics/data/services/AnalyticsDataService';
import { ChatDataService } from '../../features/chat/data/services/ChatDataService';
import { CommentDataService } from '../../features/comment/data/services/CommentDataService';
import { ContentDataService } from '../../features/content/data/services/ContentDataService';
import { FeedDataService } from '../../features/feed/data/services/FeedDataService';
import { NavbarDataService } from '../../features/navbar/data/services/NavbarDataService';
import { NotificationDataService } from '../../features/notification/data/services/NotificationDataService';
import { PostDataService } from '../../features/post/data/services/PostDataService';
import { ProfileDataService } from '../../features/profile/data/services/ProfileDataService';
import { SearchDataService } from '../../features/search/data/services/SearchDataService';
import { SettingsDataService } from '../../features/settings/data/services/SettingsDataService';
import { EnterpriseAuthService } from '../auth';
import { createCacheProvider, createCacheServiceManager } from '../cache';
import { createContainer } from '../di';
import { createDIAuthenticatedApiClient } from '../network';
import { createLogger } from '../services';
import { ThemeService } from '../services/ThemeService';
import { UserService, UserRepository } from '../services/UserService';
import { createTheme } from '../theme';
import { EnterpriseWebSocketService } from '../websocket/services/EnterpriseWebSocketService';

import { TYPES } from './types';

import type { AxiosInstance } from 'axios';

// Import repositories
import { AuthRepository } from '../../features/auth/data/repositories/AuthRepository';
import { ChatRepository } from '../../features/chat/data/repositories/ChatRepository';
import { MessageRepository } from '../../features/chat/data/repositories/MessageRepository';
import { NotificationRepository } from '../../features/notification/data/repositories/NotificationRepository';
import { SearchRepositoryImpl } from '../../features/search/data/repositories/SearchRepositoryImpl';

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
  const apiClient = createDIAuthenticatedApiClient(container);
  container.registerInstanceByToken(TYPES.API_CLIENT, apiClient);

  // Register User services using factory functions - Manual Registration + Factory Functions
  // UserRepository is registered first, then UserService with dependency injection

  container.registerSingletonByToken(
    TYPES.USER_REPOSITORY,
    UserRepository
  );

  // Create UserService instance with injected dependency
  const userService = new UserService(container.get(TYPES.USER_REPOSITORY));
  container.registerInstanceByToken(TYPES.USER_SERVICE, userService);

  // Register Logger service using factory function
  container.registerInstanceByToken(
    TYPES.LOGGER_SERVICE,
    loggerService
  );

  // Register Theme service using manual registration
  container.registerSingletonByToken(
    TYPES.THEME_SERVICE,
    ThemeService
  );

  // Register WebSocket service using manual registration
  container.registerSingletonByToken(
    TYPES.WEBSOCKET_SERVICE,
    EnterpriseWebSocketService
  );

  // Register migrated data services using manual registration
  container.registerSingletonByToken(
    TYPES.FEED_DATA_SERVICE,
    FeedDataService
  );

  container.registerSingletonByToken(
    TYPES.POST_DATA_SERVICE,
    PostDataService
  );

  container.registerSingletonByToken(
    TYPES.COMMENT_DATA_SERVICE,
    CommentDataService
  );

  container.registerSingletonByToken(
    TYPES.NOTIFICATION_DATA_SERVICE,
    NotificationDataService
  );

  container.registerSingletonByToken(
    TYPES.ANALYTICS_DATA_SERVICE,
    AnalyticsDataService
  );

  container.registerSingletonByToken(
    TYPES.CHAT_DATA_SERVICE,
    ChatDataService
  );

  container.registerSingletonByToken(
    TYPES.CONTENT_DATA_SERVICE,
    ContentDataService
  );

  container.registerSingletonByToken(
    TYPES.NAVBAR_DATA_SERVICE,
    NavbarDataService
  );

  container.registerSingletonByToken(
    TYPES.PROFILE_DATA_SERVICE,
    ProfileDataService
  );

  container.registerSingletonByToken(
    TYPES.SETTINGS_DATA_SERVICE,
    SettingsDataService
  );

  container.registerSingletonByToken(
    TYPES.SEARCH_DATA_SERVICE,
    SearchDataService
  );

  // Register repositories (commented out until feature modules are created)
  // Note: Repositories with @Injectable() decorator are auto-registered by DI container

  container.registerSingleton(AuthRepository);
  container.registerSingleton(ChatRepository);
  container.registerSingleton(MessageRepository);
  // PostRepository is auto-registered via @Injectable() decorator
  // CommentRepository is auto-registered via @Injectable() decorator
  container.registerSingleton(NotificationRepository);
  container.registerSingleton(SearchRepositoryImpl);
  // UserRepository is auto-registered via @Injectable() decorator

  // Register repositories by token for injection
  container.registerSingletonByToken(TYPES.AUTH_REPOSITORY, AuthRepository);
  container.registerSingletonByToken(TYPES.CHAT_REPOSITORY, ChatRepository);
  // MessageRepository is auto-registered via @Injectable() decorator
  // PostRepository is auto-registered via @Injectable() decorator
  // CommentRepository is auto-registered via @Injectable() decorator
  container.registerSingletonByToken(TYPES.NOTIFICATION_REPOSITORY, NotificationRepository);
  // UserRepository is auto-registered via @Injectable() decorator and available via TYPES.USER_REPOSITORY
  container.registerSingletonByToken(TYPES.SEARCH_REPOSITORY, SearchRepositoryImpl);

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
  const themeService = container.get('ThemeService');
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
  console.log('🔗 API client configured with baseURL:', apiClientInstance.defaults.baseURL);
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
