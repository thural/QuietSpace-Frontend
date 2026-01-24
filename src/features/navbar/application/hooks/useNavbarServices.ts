/**
 * Navbar Services Hook
 * 
 * Provides access to navbar services through dependency injection
 * Follows enterprise patterns for service access
 */

import { useDIContainer } from '@/core/di';
import { TYPES } from '@/core/di/types';
import type { NavbarDataService } from '../services/NavbarDataService';
import type { NavbarFeatureService } from '../services/NavbarFeatureService';

/**
 * Navbar Services Hook
 * 
 * Provides access to all navbar services through the enterprise DI container
 */
export const useNavbarServices = () => {
  const container = useDIContainer();
  
  return {
    navbarDataService: container.get<NavbarDataService>(TYPES.NAVBAR_DATA_SERVICE),
    navbarFeatureService: container.get<NavbarFeatureService>(TYPES.NAVBAR_FEATURE_SERVICE)
  };
};
