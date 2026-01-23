/**
 * Feed DI Hook.
 * 
 * React hook that provides Feed DI container and dependencies.
 * Ensures singleton pattern and proper dependency injection.
 */

import { useContext, useMemo, createContext } from 'react';
import type { JwtToken } from '@/shared/api/models/common';
import type { IPostRepository } from '../domain/entities/IPostRepository';
import { FeedDIContainer } from './FeedDIContainer';
import type { FeedDIConfig } from './FeedDIConfig';
import { useAuthStore } from '@core/store/zustand';
import { useService } from '@/core/di';
import { TYPES } from '@/core/di/types';

/**
 * Feed DI context
 */
const FeedDIContext = createContext<FeedDIContainer | null>(null);

/**
 * Hook to use Feed DI container
 */
export const useFeedDI = (config?: Partial<FeedDIConfig>): FeedDIContainer => {
    // Get auth token from Zustand store
    const authStore = useAuthStore();
    const accessToken = authStore.data.accessToken as JwtToken;

    // Create or get existing container from context
    const container = useContext(FeedDIContext);

    // Create new container if not exists
    if (!container) {
        throw new Error('useFeedDI must be used within FeedDIProvider');
    }

    return container;
};

/**
 * Provider component for Feed DI
 */
export const FeedDIProvider: React.FC<{
    children: React.ReactNode;
    config?: Partial<FeedDIConfig>;
}> = ({ children, config }) => {
    // Get auth token from Zustand store
    const authStore = useAuthStore();
    const accessToken = authStore.data.accessToken as JwtToken;
    
    // Get PostRepository from global DI container
    const postRepository = useService<IPostRepository>(TYPES.POST_REPOSITORY);

    // Create container instance
    const container = useMemo(() => {
        return FeedDIContainer.create(accessToken, config, postRepository);
    }, [accessToken, config, postRepository]);

    return (
        <FeedDIContext.Provider value={container}>
            {children}
        </FeedDIContext.Provider>
    );
};

/**
 * Hook to get repository from DI container
 */
export const useFeedRepository = (): IPostRepository => {
    const container = useFeedDI();
    return container.getPostRepository();
};

/**
 * Hook to get DI configuration
 */
export const useFeedConfig = (): FeedDIConfig => {
    const container = useFeedDI();
    return container.getConfig();
};
