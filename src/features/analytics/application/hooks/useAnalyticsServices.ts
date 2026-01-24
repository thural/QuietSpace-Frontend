import { useDIContainer } from '@/core/di';
import { TYPES } from '@/core/di/types';
import { AnalyticsDataService } from '@features/analytics/data/services/AnalyticsDataService';
import { AnalyticsFeatureService } from '@features/analytics/application/services/AnalyticsFeatureService';

/**
 * Analytics Services Hook
 * 
 * Provides access to analytics data and feature services through dependency injection
 * Follows the established pattern from auth, notification, and chat features
 */
export const useAnalyticsServices = () => {
  const container = useDIContainer();
  
  // Get services from DI container
  const analyticsDataService = container.get<AnalyticsDataService>(TYPES.ANALYTICS_DATA_SERVICE);
  const analyticsFeatureService = container.get<AnalyticsFeatureService>(TYPES.ANALYTICS_FEATURE_SERVICE);
  
  return {
    // Data service for caching and data orchestration
    analyticsDataService,
    
    // Feature service for business logic and validation
    analyticsFeatureService,
    
    // Convenience methods for common operations
    data: analyticsDataService,
    feature: analyticsFeatureService
  };
};
