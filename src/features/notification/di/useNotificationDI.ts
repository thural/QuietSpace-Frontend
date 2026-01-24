/**
 * Notification DI Hook.
 * 
 * Hook for using Notification DI container in React components.
 * Provides access to all dependencies through DI container.
 */

import { useMemo } from 'react';
import { useDIContainer } from '@core/di';
import { NotificationDIContainer } from "./NotificationDIContainer";
import type { DIContainerConfig } from './NotificationDIContainer';
import { getNotificationConfig } from './NotificationDIConfig';
import type { INotificationRepository } from "../domain/entities/INotificationRepository";

/**
 * DI Container configuration for useNotificationDI hook.
 */
export interface UseNotificationDIConfig {
    overrideConfig?: {
        useMockRepositories?: boolean;
        enableLogging?: boolean;
        // useReactQuery removed - migrated to enterprise hooks
    };
}

/**
 * Notification DI Hook.
 * 
 * Hook that provides access to the Notification DI container.
 * Returns repositories and services based on current configuration.
 */
export const useNotificationDI = (config?: UseNotificationDIConfig) => {
    const mainContainer = useDIContainer();
    const diContainer = useMemo(() => {
        const baseConfig = getNotificationConfig();
        const finalConfig: DIContainerConfig = {
            ...baseConfig,
            ...config?.overrideConfig,
        };

        return new NotificationDIContainer(mainContainer, finalConfig);
    }, [mainContainer, config]);

    // Get notification repository
    const notificationRepository = useMemo(() => {
        return diContainer.getNotificationRepository();
    }, [diContainer]);

    // Get configuration
    const diConfig = useMemo(() => {
        return diContainer.getConfig();
    }, [diContainer]);

    return {
        // Dependencies
        notificationRepository,

        // Configuration
        config: diConfig,

        // Container (for advanced usage)
        container: diContainer,

        // Utility methods
        isUsingMockRepositories: diContainer.isUsingMockRepositories(),
        isReactQueryEnabled: diContainer.isReactQueryEnabled(),
        isLoggingEnabled: diContainer.isLoggingEnabled(),
    };
};

/**
 * Hook for getting just the notification repository.
 * 
 * Convenience hook when you only need the repository.
 */
export const useNotificationRepository = (): INotificationRepository => {
    const { notificationRepository } = useNotificationDI();
    return notificationRepository;
};

/**
 * Hook for getting DI configuration.
 * 
 * Convenience hook when you only need the configuration.
 */
export const useNotificationConfig = () => {
    const { config } = useNotificationDI();
    return config;
};
