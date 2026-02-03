/**
 * Chat Feature DI Container
 * 
 * Dependency injection container configuration for the chat feature.
 * Provides all necessary services with proper scoping.
 */

import { Container } from '@/core/modules/dependency-injection/container/Container';
import { TYPES } from '@/core/modules/dependency-injection/types';
import { ChatDataService } from '@/features/chat/data/services/ChatDataService';
import { ChatFeatureService } from '@/features/chat/application/services/ChatFeatureService';
import { WebSocketService } from '@/features/chat/data/services/WebSocketService';

// Import repository implementation (adjust path as needed)
import { ChatRepository } from '@/features/chat/data/repositories/ChatRepository';

export function createChatContainer(): Container {
  const container = new Container();
  
  // Core Services (Singleton scope - shared across application)
  container.registerSingletonByToken(
    TYPES.WEBSOCKET_SERVICE,
    WebSocketService
  );
  
  // Repositories (Transient scope - new instance per injection)
  container.registerTransientByToken(
    TYPES.ICHAT_REPOSITORY, 
    ChatRepository
  );
  
  // Data Services (Singleton scope - shared across application)
  container.registerSingletonByToken(
    TYPES.CHAT_DATA_SERVICE, 
    ChatDataService
  );
  
  // Feature Services (Singleton scope - shared business logic)
  container.registerSingletonByToken(
    TYPES.CHAT_FEATURE_SERVICE, 
    ChatFeatureService
  );
  
  return container;
}

// Export the container factory for use in main application
export { createChatContainer as createChatDIContainer };

/**
 * Register chat feature services with main application container
 * Integrates all chat services into the main DI system
 */
export function registerChatContainer(mainContainer: any): void {
  console.log('💬 Registering chat feature services...');
  
  // Core Services (Singleton scope)
  mainContainer.registerSingletonByToken(
    TYPES.WEBSOCKET_SERVICE,
    WebSocketService
  );
  
  // Repositories (Transient scope)
  mainContainer.registerTransientByToken(
    TYPES.ICHAT_REPOSITORY, 
    ChatRepository
  );
  
  // Data Services (Singleton scope)
  mainContainer.registerSingletonByToken(
    TYPES.CHAT_DATA_SERVICE, 
    ChatDataService
  );
  
  // Feature Services (Singleton scope)
  mainContainer.registerSingletonByToken(
    TYPES.CHAT_FEATURE_SERVICE, 
    ChatFeatureService
  );
  
  console.log('✅ Chat feature services registered');
}
