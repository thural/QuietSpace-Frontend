/**
 * Error Module Index
 *
 * Centralized error handling system for all core modules.
 * Provides clean exports for all error handling functionality.
 */

// Types and interfaces
export * from './types/index';

// Error classes
export * from './classes/index';

// Error handlers
export * from './handlers/index';

// Error factories
export * from './factories/index';

// Error utilities
export * from './utils/index';

// Error constants
export * from './constants/index';

// Error messages
export {
    ErrorMessageGenerator,
    initializeStandardErrorMessages,
    getErrorMessage,
    generateErrorMessage,
    createStandardError,
    StandardErrorMessages
} from './messages/StandardErrorMessages';
export type { ErrorMessageTemplate, ErrorSeverity, ErrorCategory, ErrorContext } from './messages/StandardErrorMessages';
