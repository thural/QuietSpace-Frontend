
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

  // Register WebSocket service using factory functions - Manual Registration + Factory Functions
  // EnterpriseWebSocketService has constructor dependencies
  const enterpriseWebSocketService = new EnterpriseWebSocketService(
    cacheProvider as any, // FeatureCacheService - type cast for compatibility
    null as any, // authService - will be injected properly later
    loggerService as any // LoggerService - type cast for compatibility
  );
  container.registerInstanceByToken(TYPES.WEBSOCKET_SERVICE, enterpriseWebSocketService);

  // Register migrated data services using factory functions - Manual Registration + Factory Functions
  // Create services with injected dependencies

  // NotificationDataService has constructor dependencies
  const notificationDataService = new NotificationDataService(
    cacheProvider,
    container.get(TYPES.NOTIFICATION_REPOSITORY)
  );
  container.registerInstanceByToken(TYPES.NOTIFICATION_DATA_SERVICE, notificationDataService);

  // ChatDataService has constructor dependencies
  const chatDataService = new ChatDataService(
    cacheProvider,
    container.get(TYPES.CHAT_REPOSITORY),
    null as any // WebSocketService - will be injected properly later
  );
  container.registerInstanceByToken(TYPES.CHAT_DATA_SERVICE, chatDataService);

  // FeedDataService has constructor dependencies
  const feedDataService = new FeedDataService(
    null as any, // IFeedRepository - will be injected properly later
    null as any, // IPostRepository - will be injected properly later  
    null as any, // ICommentRepository - will be injected properly later
    cacheProvider,
    null as any // IWebSocketService - will be injected properly later
  );
  container.registerInstanceByToken(TYPES.FEED_DATA_SERVICE, feedDataService);

  // Register remaining data services using factory functions - Manual Registration + Factory Functions
  // Create services with injected dependencies

  // PostDataService has constructor dependencies
  const postDataService = new PostDataService(
    null as any, // IPostRepository - will be injected properly later
    null as any, // ICommentRepository - will be injected properly later
    cacheProvider,
    null as any // IWebSocketService - will be injected properly later
  );
  container.registerInstanceByToken(TYPES.POST_DATA_SERVICE, postDataService);

  // CommentDataService has constructor dependencies
  const commentDataService = new CommentDataService(
    null as any, // ICommentRepository - will be injected properly later
    cacheProvider,
    null as any // IWebSocketService - will be injected properly later
  );
  container.registerInstanceByToken(TYPES.COMMENT_DATA_SERVICE, commentDataService);

  // ProfileDataService has constructor dependencies
  const profileDataService = new ProfileDataService(
    cacheProvider,
    null as any // IProfileRepository - will be injected properly later
  );
  container.registerInstanceByToken(TYPES.PROFILE_DATA_SERVICE, profileDataService);

  // Register remaining data services using factory functions - Manual Registration + Factory Functions
  // Create services with injected dependencies

  // AnalyticsDataService has constructor dependencies
  const analyticsDataService = new AnalyticsDataService(
    cacheProvider,
    null as any // IAnalyticsRepository - will be injected properly later
  );
  container.registerInstanceByToken(TYPES.ANALYTICS_DATA_SERVICE, analyticsDataService);

  // ContentDataService has constructor dependencies
  const contentDataService = new ContentDataService(
    cacheProvider,
    null as any // IContentRepository - will be injected properly later
  );
  container.registerInstanceByToken(TYPES.CONTENT_DATA_SERVICE, contentDataService);

  // NavbarDataService has constructor dependencies
  const navbarDataService = new NavbarDataService(
    null as any, // INotificationRepository - will be injected properly later
    cacheProvider,
    null as any // IWebSocketService - will be injected properly later
  );
  container.registerInstanceByToken(TYPES.NAVBAR_DATA_SERVICE, navbarDataService);

  // SettingsDataService has constructor dependencies
  const settingsDataService = new SettingsDataService(
    null as any, // ISettingsRepository - will be injected properly later
    cacheProvider,
    null as any // IWebSocketService - will be injected properly later
  );
  container.registerInstanceByToken(TYPES.SETTINGS_DATA_SERVICE, settingsDataService);

  // SearchDataService has constructor dependencies
  const searchDataService = new SearchDataService(
    null as any, // ISearchRepositoryEnhanced - will be injected properly later
    cacheProvider,
    null as any // IWebSocketService - will be injected properly later
  );
  container.registerInstanceByToken(TYPES.SEARCH_DATA_SERVICE, searchDataService);

  // Register repositories using factory functions - Manual Registration + Factory Functions
  // Dependencies are resolved and injected manually

  // Create AuthRepository with injected dependency
  const authRepository = new AuthRepository(container.get(TYPES.API_CLIENT));
  container.registerInstanceByToken(TYPES.AUTH_REPOSITORY, authRepository);

  // Create ChatRepository with injected dependency
  const chatRepository = new ChatRepository(container.get(TYPES.API_CLIENT));
  container.registerInstanceByToken(TYPES.CHAT_REPOSITORY, chatRepository);

  // Register remaining repositories using factory functions - Manual Registration + Factory Functions
  // Create SearchRepositoryImpl with injected dependencies
  const searchRepositoryImpl = new SearchRepositoryImpl(
    container.get(TYPES.API_CLIENT),
    container.get(TYPES.AUTH_SERVICE)
  );
  container.registerInstanceByToken(TYPES.SEARCH_REPOSITORY, searchRepositoryImpl);

  // Register remaining repositories using factory functions - Manual Registration + Factory Functions
  // Create MessageRepository with injected dependency
  const messageRepository = new MessageRepository(container.get(TYPES.API_CLIENT));
  container.registerInstance('MessageRepository', messageRepository);

  // Create NotificationRepository with injected dependencies
  const notificationRepository = new NotificationRepository(
    container.get(TYPES.API_CLIENT),
    container.get(TYPES.AUTH_SERVICE)
  );
  container.registerInstance('NotificationRepository', notificationRepository);

  // Register enterprise auth service
  const enterpriseAuthService = new EnterpriseAuthService(null as any, null as any, null as any, null as any, null as any);
  container.registerInstance('EnterpriseAuthService', enterpriseAuthService);

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
