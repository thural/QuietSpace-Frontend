/**
 * Profile Feature Barrel Export.
 * 
 * Exports all profile feature modules.
 */

// Domain layer exports
export * from './domain';

// Data layer exports
export * from './data';

// Application layer exports
export * from './application';
export * from './application/services';
export * from './application/hooks';

// Presentation layer exports
export * from './presentation';

// DI exports
export * from './di';

// Legacy exports (for backward compatibility)
export { UserProfileContainer } from './presentation/components/UserProfileContainer';
export { ProfileServiceDI, useProfileDI } from './application/services/ProfileServiceDI';
