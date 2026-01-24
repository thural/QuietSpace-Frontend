/**
 * Search Application Services Barrel Export.
 * 
 * Exports all services from the application layer.
 */

// Search services
export { SearchService, type ISearchService } from './SearchService';
export { SearchQueryService, type ISearchQueryService } from './SearchQueryService';

// Enterprise services
export { SearchFeatureService } from './SearchFeatureService';

// React Query services - REMOVED - Migrated to enterprise hooks
