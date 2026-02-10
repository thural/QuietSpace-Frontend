/**
 * Configuration Module Index
 *
 * Exports configuration components with clean public API.
 * Follows Black Box pattern by exposing only interfaces and factory functions.
 */

// Main configuration loader
export { SimplifiedAuthConfigLoader } from './SimplifiedAuthConfigLoader';

// Configuration builder
export { AuthConfigBuilder } from './AuthConfigBuilder';

// Legacy loader (deprecated)
// export { AuthConfigLoader } from './AuthConfigLoader';

// Environment configuration
export { EnvironmentAuthConfig } from './EnvironmentAuthConfig';

// Configuration watcher
export { ConfigurationWatcher } from './ConfigurationWatcher';

// Default configuration
export { DefaultAuthConfig } from './DefaultAuthConfig';

// Types
export type { IAuthConfig } from '../interfaces/authInterfaces';
