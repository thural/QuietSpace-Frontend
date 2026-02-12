/**
 * Service Hooks - Enterprise Edition
 *
 * Provides hooks for accessing core services:
 * - Authentication service access
 * - Theme service access
 * - Core service management
 * - Migration utilities
 */

export {
  useCoreServices,
  useAuthService,
  useThemeService
} from './hooks';

export type {
  CoreServices,
  IAuthService,
  IThemeService
} from './hooks';

export {
  HookMigrationManager
} from './migrationUtils';

export type {
  MigrationStatus,
  HookMigrationResult
} from './migrationUtils';
