import { Container } from '@/core/modules/dependency-injection/container/Container';
import { TYPES } from '@/core/modules/dependency-injection/types';
import {
    // Repositories
    PostRepository,
    CommentRepository,

    // Data Services
    PostDataService,
    CommentDataService,
    FeedDataService,

    // Feature Services
    FeedFeatureService,
    PostFeatureService,

    // Types
    type IPostRepository,
    type ICommentRepository,
    type PostDataServiceConfig,
    type CommentDataServiceConfig,
    type FeedDataServiceConfig
} from '@/features/feed';

/**
 * Feed Feature DI Container
 * 
 * Configures all dependencies for the feed feature following Clean Architecture principles:
 * - Repositories: Transient (new instance per injection)
 * - Data Services: Singleton (shared state for caching)
 * - Feature Services: Singleton (stateless business logic)
 */

export function createFeedContainer(): Container {
    const container = Container.create();

    // ===== REPOSITORIES (Data Access Layer) =====
    // Transient scope: New instance per injection for clean state

    container.registerTransientByToken(TYPES.POST_REPOSITORY, PostRepository);
    container.registerTransientByToken(TYPES.COMMENT_REPOSITORY, CommentRepository);

    // ===== DATA SERVICES (Caching Layer) =====
    // Singleton scope: Shared for cache state management

    container.registerSingletonByToken(TYPES.POST_DATA_SERVICE, PostDataService);
    container.registerSingletonByToken(TYPES.COMMENT_DATA_SERVICE, CommentDataService);
    container.registerSingletonByToken(TYPES.FEED_DATA_SERVICE, FeedDataService);

    // ===== FEATURE SERVICES (Business Logic Layer) =====
    // Singleton scope: Stateless business logic

    container.registerSingletonByToken(TYPES.FEED_FEATURE_SERVICE, FeedFeatureService);
    container.registerSingletonByToken(TYPES.POST_FEATURE_SERVICE, PostFeatureService);

    // ===== CONFIGURATION BINDINGS =====
    // Data Service Configurations

    const postDataServiceConfig: PostDataServiceConfig = {
        defaultTTL: 300000,   // 5 minutes
        postTTL: 600000,      // 10 minutes
        feedTTL: 120000,      // 2 minutes
        enableRetry: true,
        maxRetries: 3,
        retryDelay: 1000
    };

    container.registerInstanceByToken(TYPES.POST_DATA_SERVICE_CONFIG, postDataServiceConfig);

    const commentDataServiceConfig: CommentDataServiceConfig = {
        defaultTTL: 300000,   // 5 minutes
        commentsTTL: 180000,  // 3 minutes
        enableRetry: true,
        maxRetries: 3,
        retryDelay: 1000
    };

    container.registerInstanceByToken(TYPES.COMMENT_DATA_SERVICE_CONFIG, commentDataServiceConfig);

    const feedDataServiceConfig: FeedDataServiceConfig = {
        enableCommentPreloading: true,
        maxCommentsPerPost: 3,
        feedTTL: 120000,      // 2 minutes
        enableSmartCaching: true
    };

    container.registerInstanceByToken(TYPES.FEED_DATA_SERVICE_CONFIG, feedDataServiceConfig);

    return container;
}

/**
 * Feed Container Factory
 * 
 * Creates and configures the feed feature container with all necessary dependencies.
 * This can be imported and used to register the feed feature with the main app container.
 */
export const FeedContainer = createFeedContainer();

/**
 * Helper function to get feed feature services from container
 */
export function getFeedServices(container: Container) {
    return {
        // Feature Services (Business Logic)
        feedFeatureService: container.getByToken<FeedFeatureService>(TYPES.FEED_FEATURE_SERVICE),
        postFeatureService: container.getByToken<PostFeatureService>(TYPES.POST_FEATURE_SERVICE),

        // Data Services (Caching)
        feedDataService: container.getByToken<FeedDataService>(TYPES.FEED_DATA_SERVICE),
        postDataService: container.getByToken<PostDataService>(TYPES.POST_DATA_SERVICE),
        commentDataService: container.getByToken<CommentDataService>(TYPES.COMMENT_DATA_SERVICE),

        // Repositories (Data Access)
        postRepository: container.getByToken<IPostRepository>(TYPES.POST_REPOSITORY),
        commentRepository: container.getByToken<ICommentRepository>(TYPES.COMMENT_REPOSITORY)
    };
}

/**
 * Helper function to register feed container with parent container
 */
export function registerFeedContainer(parentContainer: Container): Container {
    const feedContainer = createFeedContainer();

    // Register the feed container as a child container
    parentContainer.registerInstanceByToken(TYPES.FEED_CONTAINER, feedContainer);

    // Also register individual services for direct access if needed
    const services = getFeedServices(feedContainer);

    parentContainer.registerInstanceByToken(TYPES.FEED_FEATURE_SERVICE, services.feedFeatureService);
    parentContainer.registerInstanceByToken(TYPES.POST_FEATURE_SERVICE, services.postFeatureService);
    parentContainer.registerInstanceByToken(TYPES.FEED_DATA_SERVICE, services.feedDataService);

    return feedContainer;
}

/**
 * Container health check for feed feature
 */
export async function checkFeedContainerHealth(container: Container): Promise<{
    healthy: boolean;
    services: Record<string, boolean>;
    errors: string[];
}> {
    const services: Record<string, boolean> = {};
    const errors: string[] = [];
    let healthy = true;

    try {
        // Check repositories
        services.postRepository = container.has(TYPES.POST_REPOSITORY);
        services.commentRepository = container.has(TYPES.COMMENT_REPOSITORY);

        // Check data services
        services.postDataService = container.has(TYPES.POST_DATA_SERVICE);
        services.commentDataService = container.has(TYPES.COMMENT_DATA_SERVICE);
        services.feedDataService = container.has(TYPES.FEED_DATA_SERVICE);

        // Check feature services
        services.feedFeatureService = container.has(TYPES.FEED_FEATURE_SERVICE);
        services.postFeatureService = container.has(TYPES.POST_FEATURE_SERVICE);

        // Check configurations
        services.postDataServiceConfig = container.has(TYPES.POST_DATA_SERVICE_CONFIG);
        services.commentDataServiceConfig = container.has(TYPES.COMMENT_DATA_SERVICE_CONFIG);
        services.feedDataServiceConfig = container.has(TYPES.FEED_DATA_SERVICE_CONFIG);

        // Overall health
        healthy = Object.values(services).every(bound => bound === true);

        if (!healthy) {
            const unboundServices = Object.entries(services)
                .filter(([, bound]) => !bound)
                .map(([name]) => name);
            errors.push(`Unbound services: ${unboundServices.join(', ')}`);
        }

    } catch (error) {
        healthy = false;
        errors.push(`Container health check failed: ${(error as Error).message}`);
    }

    return {
        healthy,
        services,
        errors
    };
}

/**
 * Export container configuration for testing
 */
export const FeedContainerConfig = {
    repositories: {
        post: TYPES.POST_REPOSITORY,
        comment: TYPES.COMMENT_REPOSITORY
    },
    dataServices: {
        post: TYPES.POST_DATA_SERVICE,
        comment: TYPES.COMMENT_DATA_SERVICE,
        feed: TYPES.FEED_DATA_SERVICE
    },
    featureServices: {
        feed: TYPES.FEED_FEATURE_SERVICE,
        post: TYPES.POST_FEATURE_SERVICE
    },
    configurations: {
        postDataService: TYPES.POST_DATA_SERVICE_CONFIG,
        commentDataService: TYPES.COMMENT_DATA_SERVICE_CONFIG,
        feedDataService: TYPES.FEED_DATA_SERVICE_CONFIG
    }
};
