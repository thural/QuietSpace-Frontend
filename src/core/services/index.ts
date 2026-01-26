/**
 * Logger Module Black Box Index
 * 
 * Provides clean public API for the logger system following Black Box pattern.
 * Only interfaces and factory functions are exported - implementation details are hidden.
 */

// Public interfaces - Clean API for consumers
export type {
    ILoggerService,
    ILoggerConfig,
    ILogEntry,
    ILoggerTarget,
    LogFormat,
    ILoggerMetrics,
    ILoggerHealthStatus,
    ILoggerFactoryConfig,
    ILoggerContext
} from './interfaces';

// Enums and constants - Public API
export {
    LogLevel,
    DEFAULT_LOGGER_CONFIG,
    LOG_LEVEL_NAMES,
    LOG_LEVEL_COLORS,
    CONSOLE_METHODS,
    DEFAULT_LOG_ENTRY
} from './interfaces';

// Factory functions - Clean service creation
export {
    createLogger,
    createDefaultLogger,
    createComponentLogger,
    createLoggerWithLevel,
    createStructuredLogger,
    createLoggerFromDI,
    createSingletonLogger,
    createMockLogger
} from './factory';

// Factory registry - Extensible factory system
export {
    loggerFactoryRegistry
} from './factory';

// Utility functions - Public API helpers
export {
    createLogEntry,
    createDebugEntry,
    createInfoEntry,
    createWarnEntry,
    createErrorEntry,
    createFatalEntry,
    formatLogEntry,
    formatLogEntryWithColors,
    getConsoleMethod,
    logLevelToString,
    stringToLogLevel,
    shouldLog,
    isLogLevel,
    isLogEntry,
    isLoggerTarget,
    mergeLoggerConfig,
    validateLoggerConfig,
    createConsoleTarget,
    createFileTarget,
    createRemoteTarget,
    createCustomTarget,
    extractErrorInfo,
    sanitizeMessage,
    formatDuration,
    createTimer,
    createLoggerTimer
} from './utils';

// Type guards and validation
export {
    isLogLevel as isLogLevelType,
    isLogEntry as isLogEntryType,
    isLoggerTarget as isLoggerTargetType
} from './utils';

// Legacy exports for backward compatibility (with underscore prefix)
export {
    LoggerService as _LoggerService
} from './factory';

// Module information
export const LOGGER_MODULE_VERSION = '1.0.0';
export const LOGGER_MODULE_INFO = {
    name: 'Enterprise Logger Module',
    version: LOGGER_MODULE_VERSION,
    description: 'Centralized logging management with enterprise patterns',
    deprecatedExports: [
        '_LoggerService'
    ],
    migrationGuide: 'Use factory functions instead of direct LoggerService import'
};
