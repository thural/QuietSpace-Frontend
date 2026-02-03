/**
 * Profile Services Hook
 * 
 * Provides access to profile data and feature services through dependency injection
 * Follows the established pattern from auth, notification, and analytics features
 */
import { useDIContainer } from '@/core/modules/dependency-injection';
import { TYPES } from '@/core/modules/dependency-injection/types';
import { ProfileDataService } from '@features/profile/data/services/ProfileDataService';
import { ProfileFeatureService } from '@features/profile/application/services/ProfileFeatureService';

/**
 * Profile Services Hook
 * 
 * Hook that provides access to profile services through dependency injection
 */
export const useProfileServices = () => {
  const container = useDIContainer();
  
  // Get services from DI container
  const profileDataService = container.get<ProfileDataService>(TYPES.PROFILE_DATA_SERVICE);
  const profileFeatureService = container.get<ProfileFeatureService>(TYPES.PROFILE_FEATURE_SERVICE);
  
  return {
    // Data service for caching and data orchestration
    profileDataService,
    
    // Feature service for business logic and validation
    profileFeatureService,
    
    // Convenience methods for common operations
    data: profileDataService,
    feature: profileFeatureService
  };
};
