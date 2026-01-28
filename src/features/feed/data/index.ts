/**
 * Feed Data Layer Barrel Export.
 * 
 * Exports all data layer implementations including repositories
 * and data access objects for the Feed feature.
 */

export { PostRepository } from './repositories/PostRepository';
export { CommentRepository } from './repositories/CommentRepository';
export { MockPostRepository } from './repositories/MockPostRepository';

// Core data service
export { FeedDataService } from './FeedDataService';

// Unified models - single source of truth
export * from './models';

// Public API - Simplified data hooks using FeedDataService
export * from './hooks';
