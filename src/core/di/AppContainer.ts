import 'reflect-metadata';
import { Container } from '../di';
import { ThemeService } from '@core/services/ThemeService';
import { LoggerService } from '@core/services/LoggerService';
import { AuthModuleFactory } from '@core/auth/AuthModule';
import { EnterpriseAuthService } from '@core/auth/enterprise/AuthService';
import { EnterpriseAuthAdapter } from '@core/auth/adapters/EnterpriseAuthAdapter';
import { CacheProvider, CacheServiceManager } from '@core/cache';
import { TYPES } from '@core/di/types';
import { apiClient } from '../network/rest/apiClient';
import { registerFeedContainer } from '@features/feed/di/container';
import { registerChatContainer } from '@features/chat/di/container';
import { createSearchContainer } from '@features/search/di/container';
import { registerWebSocketServices, initializeWebSocketServices } from '@core/websocket/di/WebSocketContainer';
import type { AxiosInstance } from 'axios';

// Import repositories
import { AuthRepository } from '@features/auth/data/repositories/AuthRepository';
import { ChatRepository } from '@features/chat/data/repositories/ChatRepository';
import { MessageRepository } from '@features/chat/data/repositories/MessageRepository';
import { PostRepository } from '@features/feed/data/repositories/PostRepository';
import { CommentRepository } from '@features/feed/data/repositories/CommentRepository';
import { NotificationRepository } from '@features/notification/data/repositories/NotificationRepository';
import { UserRepository } from '@features/search/data/repositories/UserRepository';
import { SearchRepositoryImpl } from '@features/search/data/repositories/SearchRepositoryImpl';

/**
 * Application DI Container Setup.
 * 
 * Configures and initializes the dependency injection container
 * with all application services.
 */

export function createAppContainer(): Container {
  console.log('🏗️ Setting up application DI container...');

  const container = Container.create();

  // Register core services
  container.registerSingleton(LoggerService);
  container.registerSingleton(ThemeService);

  // Register cache services
  container.registerSingleton(CacheServiceManager);
  container.registerSingletonByToken(TYPES.CACHE_SERVICE, CacheServiceManager);

  // Register API client and repositories
  container.registerInstanceByToken(TYPES.API_CLIENT, apiClient);

  // Register new repositories as singletons
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

  // Register enterprise auth service using factory
  const enterpriseAuthService = AuthModuleFactory.createDefault();
  container.registerInstance(EnterpriseAuthService, enterpriseAuthService);

  // Register auth adapter
  const authAdapter = new EnterpriseAuthAdapter(enterpriseAuthService);
  container.registerInstance(EnterpriseAuthAdapter, authAdapter);

  // Example of using typed string tokens for registration
  // This provides type safety - only valid TYPES values are allowed
  container.registerInstanceByToken(TYPES.AUTH_SERVICE, enterpriseAuthService);

  // Register feed feature container and services
  console.log('📱 Registering feed feature container...');
  const feedContainer = registerFeedContainer(container);

  // Register chat feature services
  registerChatContainer(container);

  // Register search feature services
  console.log('🔍 Registering search feature container...');
  const searchContainer = createSearchContainer();

  // Register WebSocket enterprise services
  console.log('🌐 Registering WebSocket enterprise services...');
  const webSocketContainer = registerWebSocketServices(container);

  console.log('✅ Core services registered');
  console.log('✅ Feed feature container registered');
  console.log('✅ Chat feature services registered');
  console.log('✅ Search feature container registered');
  console.log('✅ WebSocket enterprise services registered');
  console.log(`📊 Container stats: ${JSON.stringify(container.getStats())}`);

  return container;
}

/**
 * Initialize application with DI
 */
export async function initializeApp(): Promise<Container> {
  const container = createAppContainer();

  // Initialize services
  const themeService = container.get(ThemeService);
  themeService.setTheme('light');

  // Example of using typed string tokens for retrieval
  // This provides type safety - only valid TYPES values are allowed
  const authService: { initialize?: () => Promise<void> } = container.getByToken(TYPES.AUTH_SERVICE);
  const apiClient: AxiosInstance = container.getByToken(TYPES.API_CLIENT);
  const postRepository = container.get(PostRepository);

  // Initialize auth service if available
  if (authService && 'initialize' in authService && typeof authService.initialize === 'function') {
    (authService as any).initialize().catch(console.error);
  }

  // Example: Demonstrate API client usage
  console.log('🔗 API client configured with baseURL:', apiClient.defaults.baseURL);
  console.log('📄 Post repository initialized with DI');

  // Example: Demonstrate feed feature service usage
  const feedFeatureService = container.getByToken(TYPES.FEED_FEATURE_SERVICE);
  const postFeatureService = container.getByToken(TYPES.POST_FEATURE_SERVICE);
  console.log('📱 Feed feature services initialized and ready');

  // Example: Demonstrate search feature service usage
  const searchFeatureService = container.getByToken(TYPES.SEARCH_FEATURE_SERVICE);
  console.log('🔍 Search feature services initialized and ready');

  // Initialize WebSocket services
  console.log('🌐 Initializing WebSocket enterprise services...');
  await initializeWebSocketServices(container);

  console.log('🚀 Application initialized with DI');

  return container;
}
