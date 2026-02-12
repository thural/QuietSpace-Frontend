/**
 * Error Enums
 * 
 * Enum definitions for error types that need to be used as values.
 */

/**
 * Error severity levels
 */
export enum ErrorSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

/**
 * Error categories
 */
export enum ErrorCategory {
    NETWORK = 'network',
    VALIDATION = 'validation',
    AUTHENTICATION = 'authentication',
    AUTHORIZATION = 'authorization',
    RUNTIME = 'runtime',
    DEPENDENCY = 'dependency',
    SYSTEM = 'system',
    DATABASE = 'database',
    SERVER = 'server',
    CLIENT = 'client',
    UNKNOWN = 'unknown'
}

/**
 * Error recovery strategies
 */
export enum ErrorRecoveryStrategy {
    IMMEDIATE = 'immediate',
    DELAYED = 'delayed',
    MANUAL = 'manual',
    AUTOMATIC = 'automatic',
    FALLBACK = 'fallback',
    NONE = 'none'
}
