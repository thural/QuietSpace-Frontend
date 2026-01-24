/**
 * Profile Application Layer Barrel Exports.
 * 
 * Provides a clean public API for the profile application layer.
 * This barrel export consolidates all application layer exports
 * for easy importing and clean dependency management.
 */

// Enterprise Hooks
export { useProfile } from './hooks/useProfile';
export { useProfileServices } from './hooks/useProfileServices';
export { useProfileConnections } from './hooks/useProfileConnections';
export { useProfileSettings } from './hooks/useProfileSettings';

// Enterprise Services
export { ProfileFeatureService } from './services/index';

// Legacy Hooks (for backward compatibility)
export { 
    useProfile, 
    useProfileEnhanced, 
    useProfileEnhancedWithState,
    useProfileAdvanced,
    type ProfileConfig
} from "./useProfile";

// Legacy Services (for backward compatibility)
export { ProfileServiceDI } from './services/ProfileServiceDI';
