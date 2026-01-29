/**
 * Feed Data Services DI Registration (Simplified)
 * 
 * Registers feed data services using the recommended hybrid approach
 */

import { Container } from '@/core/di/container/Container';
import { TYPES } from '@/core/di/types';
import { FeedDataService } from '../services/FeedDataService';
import { PostDataService } from '../services/PostDataService';
import { CommentDataService } from '../services/CommentDataService';

/**
 * Register all feed data services in the DI container
 * Uses the decorator-based auto-registration approach
 */
export function registerFeedDataServices(container: Container): void {
  // The services will be auto-registered via their @Injectable decorators
  // Just ensure the dependencies are registered first
  
  console.log('📝 Feed Data Services: Auto-registration via @Injectable decorators');
  
  // Services are automatically registered when first accessed via DI
  // The @Injectable decorators handle the registration
}

/**
 * Create feed data service instances manually (Factory Approach)
 * This is the recommended approach for better control
 */
export function createFeedDataService(container: Container): FeedDataService {
  const feedRepository = container.getByToken(TYPES.IFEED_REPOSITORY);
  const postRepository = container.getByToken(TYPES.IPOST_REPOSITORY);
  const commentRepository = container.getByToken(TYPES.ICOMMENT_REPOSITORY);
  const cacheService = container.getByToken(TYPES.CACHE_SERVICE);
  const webSocketService = container.getByToken(TYPES.WEBSOCKET_SERVICE);
  
  return new FeedDataService(
    feedRepository,
    postRepository,
    commentRepository,
    cacheService,
    webSocketService
  );
}

/**
 * Create post data service instances manually (Factory Approach)
 */
export function createPostDataService(container: Container): PostDataService {
  const postRepository = container.getByToken(TYPES.IPOST_REPOSITORY);
  const commentRepository = container.getByToken(TYPES.ICOMMENT_REPOSITORY);
  const cacheService = container.getByToken(TYPES.CACHE_SERVICE);
  const webSocketService = container.getByToken(TYPES.WEBSOCKET_SERVICE);
  
  return new PostDataService(
    postRepository,
    commentRepository,
    cacheService,
    webSocketService
  );
}

/**
 * Create comment data service instances manually (Factory Approach)
 */
export function createCommentDataService(container: Container): CommentDataService {
  const commentRepository = container.getByToken(TYPES.ICOMMENT_REPOSITORY);
  const cacheService = container.getByToken(TYPES.CACHE_SERVICE);
  const webSocketService = container.getByToken(TYPES.WEBSOCKET_SERVICE);
  
  return new CommentDataService(
    commentRepository,
    cacheService,
    webSocketService
  );
}

/**
 * Create all feed data services with custom configuration
 */
export function createFeedDataServicesWithConfig(
  container: Container,
  config: {
    feedConfig?: any;
    postConfig?: any;
    commentConfig?: any;
  }
) {
  const feedRepository = container.getByToken(TYPES.IFEED_REPOSITORY);
  const postRepository = container.getByToken(TYPES.IPOST_REPOSITORY);
  const commentRepository = container.getByToken(TYPES.ICOMMENT_REPOSITORY);
  const cacheService = container.getByToken(TYPES.CACHE_SERVICE);
  const webSocketService = container.getByToken(TYPES.WEBSOCKET_SERVICE);
  
  return {
    feedDataService: new FeedDataService(
      feedRepository,
      postRepository,
      commentRepository,
      cacheService,
      webSocketService,
      config.feedConfig
    ),
    postDataService: new PostDataService(
      postRepository,
      commentRepository,
      cacheService,
      webSocketService,
      config.postConfig
    ),
    commentDataService: new CommentDataService(
      commentRepository,
      cacheService,
      webSocketService,
      config.commentConfig
    )
  };
}
