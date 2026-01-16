/**
 * Hook for accessing Search DI Container.
 * 
 * Provides React hook interface to the Search dependency injection container.
 * Ensures singleton behavior across the application.
 */

import { useMemo } from 'react';
import { getSearchDIContainer, type DIContainerConfig } from '../../di/SearchDIContainer';

/**
 * Hook configuration for DI container.
 */
export interface UseSearchDIConfig extends DIContainerConfig {
    key?: string; // Optional key for container instance
}

/**
 * React hook for accessing Search DI Container.
 * 
 * @param config - Optional configuration for DI container
 * @returns Search DI Container instance
 */
export const useSearchDI = (config?: UseSearchDIConfig) => {
    return useMemo(() => {
        const { key, ...diConfig } = config || {};
        return getSearchDIContainer(diConfig);
    }, [config?.useMockRepositories, config?.enableLogging]);
};

/**
 * Hook for getting Search Service from DI container.
 */
export const useSearchService = () => {
    const container = useSearchDI();
    return container.getSearchService();
};

/**
 * Hook for getting Query Service from DI container.
 */
export const useQueryService = () => {
    const container = useSearchDI();
    return container.getQueryService();
};

/**
 * Hook for getting User Search Repository from DI container.
 */
export const useUserSearchRepository = () => {
    const container = useSearchDI();
    return container.getUserSearchRepository();
};

/**
 * Hook for getting Post Search Repository from DI container.
 */
export const usePostSearchRepository = () => {
    const container = useSearchDI();
    return container.getPostSearchRepository();
};
