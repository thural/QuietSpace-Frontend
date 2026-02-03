/**
 * Feed Data Services DI Registration (Simplified)
 * 
 * Registers feed data services using the recommended hybrid approach
 */

import { Container } from '@/core/modules/dependency-injection/container/Container';
import { TYPES } from '@/core/modules/dependency-injection/types';
import type { ICacheProvider } from '@/core/cache';
import type { IWebSocketService } from '@/core/websocket/types';
import type { IFeedRepository } from '../../domain/entities/IFeedRepository';
import type { IPostRepository } from '../../domain/entities/IPostRepository';
import type { ICommentRepository } from '../../domain/entities/ICommentRepository';
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
  // Get dependencies from container
  const feedRepository = container.getByToken(TYPES.IFEED_REPOSITORY) as IFeedRepository;
  const postRepository = container.getByToken(TYPES.IPOST_REPOSITORY) as IPostRepository;
  const commentRepository = container.getByToken(TYPES.ICOMMENT_REPOSITORY) as ICommentRepository;
  const cacheService = container.getByToken(TYPES.CACHE_SERVICE) as ICacheProvider;
  const webSocketService = container.getByToken(TYPES.WEBSOCKET_SERVICE) as IWebSocketService;

  // Create feed service with dependencies
  return new FeedDataService(
    feedRepository,
    postRepository,
    commentRepository,
    cacheService,
    webSocketService
  );
}

/**
 * Create post data service instance
 */
export function createPostDataService(container: Container): PostDataService {
  const postRepository = container.getByToken(TYPES.IPOST_REPOSITORY) as IPostRepository;
  const commentRepository = container.getByToken(TYPES.ICOMMENT_REPOSITORY) as ICommentRepository;
  const cacheService = container.getByToken(TYPES.CACHE_SERVICE) as ICacheProvider;
  const webSocketService = container.getByToken(TYPES.WEBSOCKET_SERVICE) as IWebSocketService;

  return new PostDataService(
    postRepository,
    commentRepository,
    cacheService,
    webSocketService
  );
}

/**
 * Create comment data service instance
 */
export function createCommentDataService(container: Container): CommentDataService {
  const commentRepository = container.getByToken(TYPES.ICOMMENT_REPOSITORY) as ICommentRepository;
  const cacheService = container.getByToken(TYPES.CACHE_SERVICE) as ICacheProvider;
  const webSocketService = container.getByToken(TYPES.WEBSOCKET_SERVICE) as IWebSocketService;

  return new CommentDataService(
    commentRepository,
    cacheService,
    webSocketService
  );
}

/**
 * Get all feed data services from container
 */
export function getFeedDataServices(container: Container) {
  return {
    feedDataService: container.getByToken<FeedDataService>(TYPES.FEED_DATA_SERVICE),
    postDataService: container.getByToken<PostDataService>(TYPES.POST_DATA_SERVICE),
    commentDataService: container.getByToken<CommentDataService>(TYPES.COMMENT_DATA_SERVICE),
  };
}

/**
 * DI Configuration for Feed Data Services
 */
export const FeedDataServicesDI = {
  registerFeedDataServices,
  createFeedDataService,
  createPostDataService,
  createCommentDataService,
  getFeedDataServices,
} as const;
