/**
 * Posts Data Layer Index
 * 
 * Exports all posts-related data layer functionality including repositories,
 * services, and models for the posts sub-feature.
 */

// Repository implementations
export * from './repositories/PostRepository';
export * from './repositories/MockPostRepository';

// Data services
export * from './services/PostDataService';

// Data models and types
export * from './models/post';
