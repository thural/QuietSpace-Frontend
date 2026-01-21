/**
 * Feed Data Layer Barrel Export.
 * 
 * Exports all data layer implementations including repositories
 * and data access objects for the Feed feature.
 */

export { PostRepository } from './repositories/PostRepository';
export { MockPostRepository } from './repositories/MockPostRepository';

// Public API - Cross-feature data hooks
export * from './usePostData';
