/**
 * Platform-Specific DI Container Factory
 *
 * Implements the Manual Registration + Factory Functions pattern
 * with build-time configuration for maximum tree-shaking.
 */

import { PLATFORM_CONFIG } from '../../config/platform-configs';
import { Container } from '../container/Container';
import { TYPES } from '../types';

import type { BuildConfig, Platform, ServiceRegistration } from '../../config/types';
import type { TypeKeys } from '../types';

/**
 * Platform-Specific Service Registration
 * Services are registered based on platform capabilities
 */
function registerPlatformServices(container: Container, config: BuildConfig): void {
  // WebSocket Service - Only for platforms that support it
  if (config.enableWebSocket) {
    container.registerSingletonByToken(
      TYPES.WEBSOCKET_SERVICE,
      () => {
        // Placeholder for WebSocket service
        console.log('WebSocket service would be registered here');
        return { connect: () => { }, disconnect: () => { } };
      }
    );
  }

  // Cache Service - Platform-specific implementations
  if (config.cacheStrategy === 'memory') {
    container.registerSingletonByToken(
      TYPES.CACHE_SERVICE,
      () => {
        // Placeholder for Memory Cache Provider
        console.log('Memory cache provider would be registered here');
        return { get: () => { }, set: () => { }, clear: () => { } };
      }
    );
  } else if (config.cacheStrategy === 'persistent') {
    container.registerSingletonByToken(
      TYPES.CACHE_SERVICE,
      () => {
        // Placeholder for Persistent Cache Provider
        console.log('Persistent cache provider would be registered here');
        return { get: () => { }, set: () => { }, clear: () => { } };
      }
    );
  } else {
    // Hybrid strategy
    container.registerSingletonByToken(
      TYPES.CACHE_SERVICE,
      () => {
        // Placeholder for Hybrid Cache Provider
        console.log('Hybrid cache provider would be registered here');
        return { get: () => { }, set: () => { }, clear: () => { } };
      }
    );
  }

  // Push Notifications - Only for platforms that support it
  if (config.enablePushNotifications) {
    if (config.platform === 'mobile') {
      container.registerSingletonByToken(
        TYPES.PUSH_NOTIFICATION_SERVICE,
        () => {
          // Placeholder for Mobile Push Service
          console.log('Mobile push service would be registered here');
          return { subscribe: () => { }, unsubscribe: () => { } };
        }
      );
    } else if (config.platform === 'web') {
      container.registerSingletonByToken(
        TYPES.PUSH_NOTIFICATION_SERVICE,
        () => {
          // Placeholder for Web Push Service
          console.log('Web push service would be registered here');
          return { subscribe: () => { }, unsubscribe: () => { } };
        }
      );
    } else if (config.platform === 'desktop') {
      container.registerSingletonByToken(
        TYPES.PUSH_NOTIFICATION_SERVICE,
        () => {
          // Placeholder for Desktop Push Service
          console.log('Desktop push service would be registered here');
          return { subscribe: () => { }, unsubscribe: () => { } };
        }
      );
    }
  }

  // Background Sync - Only for platforms that support it
  if (config.enableBackgroundSync && (config.platform === 'mobile' || config.platform === 'desktop')) {
    container.registerSingletonByToken(
      'BACKGROUND_SYNC_SERVICE' as TypeKeys,
      () => {
        // Placeholder for Background Sync Service
        console.log('Background sync service would be registered here');
        return { sync: () => { }, schedule: () => { } };
      }
    );
  }

  // Platform-specific repositories
  registerPlatformRepositories(container, config);
}

/**
 * Platform-Specific Repository Registration
 */
function registerPlatformRepositories(container: Container, config: BuildConfig): void {
  // Feed Repository - Platform-specific implementations
  if (config.platform === 'mobile') {
    container.registerSingletonByToken(
      TYPES.IFEED_REPOSITORY,
      () => {
        // Placeholder for Mobile Feed Repository
        console.log('Mobile feed repository would be registered here');
        return { getFeed: () => { }, createPost: () => { } };
      }
    );
  } else if (config.platform === 'server') {
    container.registerSingletonByToken(
      TYPES.IFEED_REPOSITORY,
      () => {
        // Placeholder for Server Feed Repository
        console.log('Server feed repository would be registered here');
        return { getFeed: () => { }, createPost: () => { } };
      }
    );
  } else {
    // Web and Desktop use the same repository
    container.registerSingletonByToken(
      TYPES.IFEED_REPOSITORY,
      () => {
        // Placeholder for Web Feed Repository
        console.log('Web feed repository would be registered here');
        return { getFeed: () => { }, createPost: () => { } };
      }
    );
  }

  // Post Repository - Platform-specific implementations
  if (config.platform === 'mobile') {
    container.registerSingletonByToken(
      TYPES.IPOST_REPOSITORY,
      () => {
        // Placeholder for Mobile Post Repository
        console.log('Mobile post repository would be registered here');
        return { getPost: () => { }, updatePost: () => { } };
      }
    );
  } else if (config.platform === 'server') {
    container.registerSingletonByToken(
      TYPES.IPOST_REPOSITORY,
      () => {
        // Placeholder for Server Post Repository
        console.log('Server post repository would be registered here');
        return { getPost: () => { }, updatePost: () => { } };
      }
    );
  } else {
    // Web and Desktop use the same repository
    container.registerSingletonByToken(
      TYPES.IPOST_REPOSITORY,
      () => {
        // Placeholder for Web Post Repository
        console.log('Web post repository would be registered here');
        return { getPost: () => { }, updatePost: () => { } };
      }
    );
  }

  // Chat Repository - Platform-specific implementations
  if (config.platform === 'server') {
    container.registerSingletonByToken(
      TYPES.ICHAT_REPOSITORY,
      () => {
        // Placeholder for Server Chat Repository
        console.log('Server chat repository would be registered here');
        return { getMessages: () => { }, sendMessage: () => { } };
      }
    );
  } else {
    // All client platforms use the same repository
    container.registerSingletonByToken(
      TYPES.ICHAT_REPOSITORY,
      () => {
        // Placeholder for Client Chat Repository
        console.log('Client chat repository would be registered here');
        return { getMessages: () => { }, sendMessage: () => { } };
      }
    );
  }
}

/**
 * Core Service Registration
 * Services that are common across all platforms
 */
function registerCoreServices(container: Container, config: BuildConfig): void {
  // Authentication Service - Core service
  container.registerSingletonByToken(
    TYPES.AUTH_SERVICE,
    () => {
      // Placeholder for Auth Service
      console.log('Auth service would be registered here');
      return { login: () => { }, logout: () => { }, isAuthenticated: () => false };
    }
  );

  // Logger Service - Platform-specific log levels
  container.registerSingletonByToken(
    'LOGGER_SERVICE' as TypeKeys,
    () => {
      // Placeholder for Logger Service
      console.log('Logger service would be registered here');
      return { log: () => { }, error: () => { }, warn: () => { }, info: () => { } };
    }
  );

  // API Service - Platform-specific endpoints
  container.registerSingletonByToken(
    'API_SERVICE' as TypeKeys,
    () => {
      // Placeholder for API Service
      console.log('API service would be registered here');
      return { get: () => { }, post: () => { }, put: () => { }, delete: () => { } };
    }
  );

  // Theme Service - All platforms
  container.registerSingletonByToken(
    'THEME_SERVICE' as TypeKeys,
    () => {
      // Placeholder for Theme Service
      console.log('Theme service would be registered here');
      return { getTheme: () => { }, setTheme: () => { } };
    }
  );
}

/**
 * Feature Service Registration
 * Register feature-specific services with platform considerations
 */
function registerFeatureServices(container: Container, config: BuildConfig): void {
  // Feed Data Service - Uses platform-specific repositories
  container.registerSingletonByToken(
    TYPES.FEED_DATA_SERVICE,
    () => {
      // Placeholder for Feed Data Service
      console.log('Feed data service would be registered here');
      return {
        getFeed: () => { },
        createPost: () => { },
        getPost: () => { },
        updatePost: () => { },
        deletePost: () => { }
      };
    }
  );

  // Chat Data Service - Real-time features only on supported platforms
  if (config.enableRealtimeFeatures) {
    container.registerSingletonByToken(
      TYPES.CHAT_DATA_SERVICE,
      () => {
        // Placeholder for Chat Data Service
        console.log('Chat data service would be registered here');
        return {
          getMessages: () => { },
          sendMessage: () => { },
          getChatRooms: () => { },
          createChatRoom: () => { }
        };
      }
    );
  }

  // Notification Service - Platform-specific implementations
  if (config.enablePushNotifications) {
    container.registerSingletonByToken(
      TYPES.NOTIFICATION_DATA_SERVICE,
      () => {
        // Placeholder for Notification Service
        console.log('Notification service would be registered here');
        return {
          getNotifications: () => { },
          markAsRead: () => { },
          sendNotification: () => { }
        };
      }
    );
  }
}

/**
 * Create Platform-Specific DI Container
 *
 * This is the main factory function that creates a container with
 * platform-specific services registered according to the build configuration.
 *
 * @param config - Platform-specific build configuration
 * @returns Configured DI container with platform-appropriate services
 */
export function createPlatformContainer(config: BuildConfig = PLATFORM_CONFIG): Container {
  const container = new Container();

  // Register core services (common to all platforms)
  registerCoreServices(container, config);

  // Register platform-specific services
  registerPlatformServices(container, config);

  // Register feature services
  registerFeatureServices(container, config);

  // Log container creation in development
  if (config.enableDevTools && config.logLevel !== 'none') {
    console.log(`🚀 Platform DI Container created for: ${config.platform}`);
    console.log(`📦 Bundle optimization: ${config.bundleOptimization}`);
    console.log(`🔗 WebSocket: ${config.enableWebSocket ? 'enabled' : 'disabled'}`);
    console.log(`💾 Cache strategy: ${config.cacheStrategy}`);
  }

  return container;
}

/**
 * Create Development Container
 * Enhanced container with development-specific features
 */
export function createDevelopmentContainer(platform?: Platform): Container {
  const config = { ...PLATFORM_CONFIG, enableDevTools: true, logLevel: 'debug' as const };
  if (platform) {
    config.platform = platform;
  }

  return createPlatformContainer(config);
}

/**
 * Create Production Container
 * Optimized container for production builds
 */
export function createProductionContainer(platform?: Platform): Container {
  const config = { ...PLATFORM_CONFIG, enableDevTools: false, logLevel: 'error' as const };
  if (platform) {
    config.platform = platform;
  }

  return createPlatformContainer(config);
}

/**
 * Create Test Container
 * Container for testing with mock services
 */
export function createTestContainer(mocks?: Record<string, any>, platform: Platform = 'web'): Container {
  const config = { ...PLATFORM_CONFIG, platform, enableDevTools: true, logLevel: 'debug' as const };
  const container = createPlatformContainer(config);

  // Register mock services if provided
  if (mocks) {
    Object.entries(mocks).forEach(([token, mockService]) => {
      container.registerInstanceByToken(token as TypeKeys, mockService);
    });
  }

  return container;
}

/**
 * Get Container Statistics
 * Returns container information for debugging and monitoring
 */
export function getContainerStats(container: Container) {
  return container.getStats();
}
