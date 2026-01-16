/**
 * Chat DI Hook.
 * 
 * Hook for using Chat DI container in React components.
 * Provides access to all dependencies through DI container.
 */

import { useMemo } from 'react';
import { ChatDIContainer, type DIContainerConfig } from './ChatDIContainer';
import { getChatConfig } from './ChatDIConfig';

/**
 * DI Container configuration for useChatDI hook.
 */
export interface UseChatDIConfig {
    overrideConfig?: {
        useMockRepositories?: boolean;
        enableLogging?: boolean;
        useReactQuery?: boolean;
    };
}

/**
 * Chat DI Hook.
 * 
 * Provides access to Chat DI container and its dependencies.
 */
export const useChatDI = (config?: UseChatDIConfig) => {
    const diContainer = useMemo(() => {
        const baseConfig = getChatConfig();
        const finalConfig = config?.overrideConfig 
            ? { ...baseConfig, ...config.overrideConfig }
            : baseConfig;
            
        return new ChatDIContainer(finalConfig);
    }, [config?.overrideConfig]);

    return diContainer;
};

/**
 * Hook to get chat repository from DI container.
 */
export const useChatRepository = () => {
    const diContainer = useChatDI();
    return diContainer.getChatRepository();
};

/**
 * Hook to get chat service from DI container.
 */
export const useChatService = () => {
    const diContainer = useChatDI();
    return diContainer.getChatService();
};
