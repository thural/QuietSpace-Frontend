/**
 * Feed Data Layer Barrel Export.
 * 
 * Exports all data layer implementations including repositories
 * and data access objects for the Feed feature.
 */

// Repository implementations
export { PostRepository } from './repositories/PostRepository';
export { CommentRepository } from './repositories/CommentRepository';
export { MockPostRepository } from './repositories/MockPostRepository';

// Data services
export { FeedDataService } from './services/FeedDataService';
export { PostDataService } from './services/PostDataService';
export { CommentDataService } from './services/CommentDataService';

// DI configuration and factory functions
export * from './di';

// Unified models - single source of truth
export * from './models';

// Public API - Simplified data hooks using FeedDataService
export * from './hooks';
