import { Container } from '@/core/di';
import { TYPES } from '@/core/di/types';
import { ProfileRepository } from '../../data/ProfileRepository';
import { ProfileDataService } from '../../data/services/ProfileDataService';
import { ProfileFeatureService } from '../../application/services/ProfileFeatureService';

/**
 * Profile DI Container
 * 
 * Dependency injection container for profile feature
 * Provides enterprise-grade service management with proper scoping
 */

export function createProfileContainer(): Container {
  const container = new Container();
  
  // Register repositories (transient - new instance per injection)
  container.bind(TYPES.PROFILE_REPOSITORY)
    .to(ProfileRepository)
    .inTransientScope();
  
  // Register data services (singleton - shared state for caching)
  container.bind(TYPES.PROFILE_DATA_SERVICE)
    .to(ProfileDataService)
    .inSingletonScope();
  
  // Register feature services (singleton - stateless business logic)
  container.bind(TYPES.PROFILE_FEATURE_SERVICE)
    .to(ProfileFeatureService)
    .inSingletonScope();
  
  return container;
}

/**
 * Profile container factory
 */
export const ProfileContainer = {
  create: createProfileContainer
};

/**
 * Default profile container instance
 */
export const defaultProfileContainer = createProfileContainer();
