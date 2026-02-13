/**
 * Logging Module Index
 * 
 * Public API for the centralized logging system.
 * Provides clean exports for all logging functionality.
 */

// Types and interfaces
export * from './types/index';

// Classes
export * from './classes/index';

// Core implementations
export * from './core/LoggerRegistry';

// Factories
export * from './factories/LoggerFactory';

// Re-export commonly used items for convenience
export type {
  ILogger,
  IAppender,
  ILayout,
  ILogEntry,
  ILoggingContext,
  ILoggingSystemConfig
} from './types';

export {
  LogLevel,
  LoggingContext,
  LoggingContextBuilder,
  ContextUtils
} from './types';

export {
  BaseLogger,
  BaseAppender,
  BaseLayout
} from './classes';

export {
  EnterpriseLogger
} from './core';

export {
  LoggerFactory,
  loggerFactory,
  getLogger,
  createAppender,
  createLayout
} from './factories';

export {
  LoggerRegistry,
  loggerRegistry,
  configureLogging,
  shutdownLogging
} from './core';

// Default exports for easy usage
export { getLogger as default } from './core/LoggerRegistry';
