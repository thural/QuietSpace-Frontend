/**
 * Profile Hooks Barrel Export.
 * 
 * Exports all hooks with enterprise-grade architecture.
 */

// Enterprise Hooks
export { useProfile } from './useProfile';
export { useProfileServices } from './useProfileServices';
export { useProfileConnections } from './useProfileConnections';
export { useProfileSettings } from './useProfileSettings';

// Legacy Hooks (for backward compatibility)
export { useProfileDI } from '../services/ProfileServiceDI';
