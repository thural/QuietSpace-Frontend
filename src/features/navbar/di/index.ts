/**
 * Navbar Feature DI Barrel Exports.
 * 
 * Provides clean public API for the navbar dependency injection system.
 */

// Container and factory functions
export { 
  createNavbarContainer, 
  defaultNavbarContainer,
  createNavbarContainerFactory 
} from './container';

// Service interfaces
export type {
  INavbarService,
  INavbarApplicationService,
  NavbarConfig,
  NavbarState
} from './container';

// Service implementations
export {
  NavbarService,
  NavbarApplicationService
} from './container';

// Service tokens
export {
  INotificationRepositoryToken,
  INavbarServiceToken,
  INavbarApplicationServiceToken
} from './container';
