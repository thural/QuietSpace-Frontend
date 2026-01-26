/**
 * Search Services Hook
 * 
 * Provides access to search data and feature services through dependency injection
 * Follows the established pattern from auth, notification, analytics, and profile features
 */

import { Container } from '@/core/di/container/Container';
import { TYPES } from '@/core/di/types';
import { SearchDataService } from '@features/search/data/services/SearchDataService';
import { SearchFeatureService } from '@features/search/application/services/SearchFeatureService';

/**
 * Search Services Hook
 * 
 * Hook that provides access to search services through dependency injection
 */
export const useSearchServices = () => {
  const container = useDIContainer();

  // Get services from DI container
  const searchDataService = container.get<SearchDataService>(TYPES.SEARCH_DATA_SERVICE);
  const searchFeatureService = container.get<SearchFeatureService>(TYPES.SEARCH_FEATURE_SERVICE);

  return {
    // Data service for caching and data orchestration
    searchDataService,

    // Feature service for business logic and validation
    searchFeatureService,

    // Convenience methods for common operations
    data: searchDataService,
    feature: searchFeatureService
  };
};
