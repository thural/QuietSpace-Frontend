/**
 * Content Services Hook
 * 
 * Provides access to content services through dependency injection
 * Follows enterprise patterns for service access
 */

import { useDIContainer } from '@/core/modules/dependency-injection';
import { TYPES } from '@/core/modules/dependency-injection/types';
import type { ContentDataService } from '../services/ContentDataService';
import type { ContentFeatureService } from '../services/ContentFeatureService';
import type { IContentRepository } from '../domain/entities/ContentEntity';

/**
 * Content Services Hook
 * 
 * Provides access to all content services through the enterprise DI container
 */
export const useContentServices = () => {
  const container = useDIContainer();
  
  return {
    contentDataService: container.get<ContentDataService>(TYPES.CONTENT_DATA_SERVICE),
    contentFeatureService: container.get<ContentFeatureService>(TYPES.CONTENT_FEATURE_SERVICE),
    contentRepository: container.get<IContentRepository>(TYPES.CONTENT_REPOSITORY)
  };
};
