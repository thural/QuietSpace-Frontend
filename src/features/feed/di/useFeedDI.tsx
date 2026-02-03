/**
 * Feed DI Hook.
 * 
 * React hook that provides Feed DI container and dependencies.
 * Ensures singleton pattern and proper dependency injection.
 */

import { useContext, useMemo, createContext } from 'react';
import type { IPostRepository } from '../domain/entities/IPostRepository';
import { FeedDIContainer } from './FeedDIContainer';
import type { FeedDIConfig } from './FeedDIConfig';
import { useService } from '@/core/modules/dependency-injection';
import { TYPES } from '@/core/modules/dependency-injection/types';

/**
 * Feed DI context
 */
const FeedDIContext = createContext<FeedDIContainer | null>(null);

/**
 * Hook to use Feed DI container
 */
export const useFeedDI = (config?: Partial<FeedDIConfig>): FeedDIContainer => {
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
    // Get PostRepository from global DI container
    const postRepository = useService<IPostRepository>(TYPES.POST_REPOSITORY);

    // Create container instance without auth token
    const container = useMemo(() => {
        return FeedDIContainer.create(config, postRepository);
    }, [config, postRepository]);

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
