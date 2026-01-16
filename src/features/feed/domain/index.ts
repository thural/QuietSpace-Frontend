/**
 * Feed Domain Layer Barrel Export.
 * 
 * Exports all domain entities, interfaces, and business logic
 * for the Feed feature.
 */

export type { 
    IPostRepository,
    PostQuery,
    PostFilters
} from './entities/IPostRepository';

export { 
    Post,
    PostFactory,
    POST_VALIDATION,
    PostInteractionType,
    PostStatus,
    PostSortOption,
    type PostEngagement,
    type PostContentValidation,
    type PostVisibility
} from './entities/PostEntities';
