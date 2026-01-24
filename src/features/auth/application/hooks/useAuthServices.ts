import { useDIContainer } from '@/core/di';
import { TYPES } from '@/core/di/types';
import { AuthDataService } from '@features/auth/data/services/AuthDataService';
import { AuthFeatureService } from '@features/auth/application/services/AuthFeatureService';

/**
 * Auth Services Hook
 * 
 * Provides access to auth data and feature services through dependency injection
 * Follows the established pattern from chat feature for consistency
 */
export const useAuthServices = () => {
  const container = useDIContainer();
  
  // Get services from DI container
  const authDataService = container.get<AuthDataService>(TYPES.AUTH_DATA_SERVICE);
  const authFeatureService = container.get<AuthFeatureService>(TYPES.AUTH_FEATURE_SERVICE);
  
  return {
    // Data service for caching and data orchestration
    authDataService,
    
    // Feature service for business logic and validation
    authFeatureService,
    
    // Convenience methods for common operations
    data: authDataService,
    feature: authFeatureService
  };
};
