import 'reflect-metadata';
import {Container} from '../di';
import {ThemeService} from '@core/services/ThemeService';
import {LoggerService} from './test/SimpleTest';
import {AuthModuleFactory} from '@core/auth/AuthModule';
import {EnterpriseAuthService} from '@core/auth/enterprise/AuthService';
import {EnterpriseAuthAdapter} from '@core/auth/adapters/EnterpriseAuthAdapter';
import {TYPES} from '@core/di/types';
import {apiClient} from '../network/rest/apiClient';
import type {AxiosInstance} from 'axios';

// Import repositories
import {AuthRepository} from '@features/auth/data/repositories/AuthRepository';
import {ChatRepository} from '@features/chat/data/repositories/ChatRepository';
import {MessageRepository} from '@features/chat/data/repositories/MessageRepository';
import {PostRepository} from '@features/feed/data/repositories/PostRepository';
import {CommentRepository} from '@features/feed/data/repositories/CommentRepository';
import {NotificationRepository} from '@features/notification/data/repositories/NotificationRepository';
import {UserRepository} from '@features/search/data/repositories/UserRepository';

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
  
  // Register repositories by token for injection
  container.registerSingletonByToken(TYPES.AUTH_REPOSITORY, AuthRepository);
  container.registerSingletonByToken(TYPES.CHAT_REPOSITORY, ChatRepository);
  container.registerSingletonByToken(TYPES.MESSAGE_REPOSITORY, MessageRepository);
  container.registerSingletonByToken(TYPES.POST_REPOSITORY, PostRepository);
  container.registerSingletonByToken(TYPES.COMMENT_REPOSITORY, CommentRepository);
  container.registerSingletonByToken(TYPES.NOTIFICATION_REPOSITORY, NotificationRepository);
  container.registerSingletonByToken(TYPES.USER_REPOSITORY, UserRepository);
  
  // Register enterprise auth service using factory
  const enterpriseAuthService = AuthModuleFactory.createDefault();
  container.registerInstance(EnterpriseAuthService, enterpriseAuthService);
  
  // Register auth adapter
  const authAdapter = new EnterpriseAuthAdapter(enterpriseAuthService);
  container.registerInstance(EnterpriseAuthAdapter, authAdapter);
  
  // Example of using typed string tokens for registration
  // This provides type safety - only valid TYPES values are allowed
  container.registerInstanceByToken(TYPES.AUTH_SERVICE, enterpriseAuthService);
  
  console.log('✅ Core services registered');
  console.log(`📊 Container stats: ${JSON.stringify(container.getStats())}`);
  
  return container;
}

/**
 * Initialize application with DI
 */
export function initializeApp(): Container {
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
  
  console.log('🚀 Application initialized with DI');
  
  return container;
}

