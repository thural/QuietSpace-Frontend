/**
 * Feed DI Barrel Export.
 * 
 * Exports all dependency injection components for the Feed feature.
 */

export type { FeedDIConfig } from './FeedDIConfig';
export { FeedDIContainer } from './FeedDIContainer';
export { 
    useFeedDI, 
    FeedDIProvider, 
    useFeedRepository, 
    useFeedConfig 
} from './useFeedDI';
