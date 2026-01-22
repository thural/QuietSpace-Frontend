import 'reflect-metadata';
import { Container } from '../di';
import { ThemeService } from '@core/services/ThemeService';
import { LoggerService } from './test/SimpleTest';
import { AuthModuleFactory } from '@core/auth/AuthModule';
import { EnterpriseAuthService } from '@core/auth/enterprise/AuthService';
import { EnterpriseAuthAdapter } from '@core/auth/adapters/EnterpriseAuthAdapter';
import { TYPES } from '@core/di/types';
import { apiClient } from '../network/rest/apiClient';
import { PostRepositoryDI } from '@features/feed/data/repositories/PostRepositoryDI';
import type { AxiosInstance } from 'axios';

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
  
  // Register API client and repository
  container.registerInstanceByToken(TYPES.API_CLIENT, apiClient);
  container.registerSingleton(PostRepositoryDI);
  
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
  const postRepository = container.get(PostRepositoryDI);
  
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

