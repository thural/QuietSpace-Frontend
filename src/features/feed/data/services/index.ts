/**
 * Feed Data Services Index
 * 
 * Exports all feed data services and related types
 */

// Data Services
export { FeedDataService } from './FeedDataService';
export { PostDataService } from './PostDataService';
// Note: CommentDataService is not yet implemented

// Types and Interfaces
export type {
  FeedItem,
  FeedPage,
  FeedQuery,
  FeedDataServiceConfig
} from './FeedDataService';

// Post types are imported from the post feature module
export type { Post, IPostDataService } from './PostDataService';
// Comment types are not yet implemented
