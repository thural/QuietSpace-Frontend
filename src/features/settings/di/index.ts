/**
 * Settings DI Barrel Export.
 * 
 * Exports all DI-related components for Settings feature.
 */

// DI Container
export { SettingsDIContainer, type DIContainerConfig } from './SettingsDIContainer';

// DI Configuration
export { 
    developmentConfig, 
    productionConfig, 
    testConfig, 
    getSettingsConfig 
} from './SettingsDIConfig';

// DI Hooks
export { 
    useSettingsDI, 
    useSettingsRepository, 
    useSettingsService,
    type UseSettingsDIConfig 
} from './useSettingsDI';
