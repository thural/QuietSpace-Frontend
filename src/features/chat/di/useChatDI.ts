/**
 * Chat DI Hook.
 * 
 * Hook for using Chat DI container in React components.
 * Provides access to all dependencies through DI container.
 */

import { useMemo } from 'react';
import { useDIContainer } from '@core/di';
import { ChatDIContainer } from "@chat/di/ChatDIContainer";
import type { DIContainerConfig } from '@chat/di/ChatDIContainer';
import { getChatConfig } from './ChatDIConfig';
import type { IChatRepository } from "@chat/domain/entities/IChatRepository";

/**
 * DI Container configuration for useChatDI hook.
 */
export interface UseChatDIConfig {
    overrideConfig?: {
        useMockRepositories?: boolean;
        enableLogging?: boolean;
    };
}

/**
 * Chat DI Hook.
 * 
 * Provides access to Chat DI container and its dependencies.
 */
export const useChatDI = (config?: UseChatDIConfig) => {
    const mainContainer = useDIContainer();
    const diContainer = useMemo(() => {
        const baseConfig = getChatConfig();
        const finalConfig = config?.overrideConfig
            ? { ...baseConfig, ...config.overrideConfig }
            : baseConfig;

        return new ChatDIContainer(mainContainer, finalConfig);
    }, [mainContainer, config?.overrideConfig]);

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

/**
 * Hook to get WebSocket service from DI container.
 */
export const useWebSocketService = () => {
    const diContainer = useChatDI();
    return diContainer.getWebSocketService();
};
