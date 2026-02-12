/**
 * UI Hooks - Dependency Injection Integration
 *
 * Provides React hooks for dependency injection container access:
 * - DI container access
 * - Service resolution
 * - Context management
 * - Scoped container creation
 */

export {
  DIProvider,
  useDIContainer,
  useDIContext,
  useService,
  useTryService,
  useHasService,
  useDIScope
} from './ReactProvider';

export type {
  DIContext,
  ServiceIdentifier
} from './ReactProvider';
