/**
 * Feed Data Service Interfaces
 * 
 * Exports all interfaces for the feed data service layer.
 * Provides proper dependency injection contracts.
 */

export type {
    FeedItem,
    FeedPage,
    FeedDataServiceConfig,
    IFeedDataService,
    IFeedDataServiceFactory
} from './IFeedDataService';

export type {
    IPostDataService
} from './IPostDataService';

export type {
    ICommentDataService
} from './ICommentDataService';
