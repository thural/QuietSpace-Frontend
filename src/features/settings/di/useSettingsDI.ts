/**
 * Settings DI Hook.
 * 
 * Hook for using the Settings DI container in React components.
 * Provides access to all dependencies through the DI container.
 */

import { useMemo } from 'react';
import { SettingsDIContainer } from './SettingsDIContainer';
import { getSettingsConfig } from './SettingsDIConfig';

/**
 * DI Container configuration for useSettingsDI hook.
 */
export interface UseSettingsDIConfig {
    overrideConfig?: {
        useMockRepositories?: boolean;
        enableLogging?: boolean;
        useReactQuery?: boolean;
    };
}

/**
 * Settings DI Hook.
 * 
 * Provides access to the Settings DI container and its dependencies.
 * 
 * @param config - Optional configuration overrides
 * @returns DI container instance
 */
export const useSettingsDI = (config?: UseSettingsDIConfig) => {
    const diContainer = useMemo(() => {
        const baseConfig = getSettingsConfig();
        const finalConfig = config?.overrideConfig 
            ? { ...baseConfig, ...config.overrideConfig }
            : baseConfig;
            
        return new SettingsDIContainer(finalConfig);
    }, [config?.overrideConfig]);

    return diContainer;
};

/**
 * Hook to get settings repository from DI container.
 */
export const useSettingsRepository = () => {
    const diContainer = useSettingsDI();
    return diContainer.getSettingsRepository();
};

/**
 * Hook to get settings service from DI container.
 */
export const useSettingsService = () => {
    const diContainer = useSettingsDI();
    return diContainer.getSettingsService();
};
