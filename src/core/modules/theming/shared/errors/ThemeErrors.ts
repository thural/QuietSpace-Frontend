/**
 * Theme System Error Handling
 *
 * Single Responsibility: Provides structured error handling for theme system
 * Follows SOLID principles with comprehensive error types and recovery strategies
 */

/**
 * Base Theme Error Class
 * 
 * Single Responsibility: Base error for all theme-related errors
 * Open/Closed: Extensible for specific error types
 */
export abstract class ThemeError extends Error {
    public readonly code: string;
    public readonly category: ErrorCategory;
    public readonly severity: ErrorSeverity;
    public readonly recovery?: RecoveryStrategy;
    public readonly context?: Record<string, unknown>;

    constructor(
        message: string,
        code: string,
        category: ErrorCategory,
        severity: ErrorSeverity,
        recovery?: RecoveryStrategy,
        context?: Record<string, unknown>
    ) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.category = category;
        this.severity = severity;
        this.recovery = recovery;
        this.context = context;

        // Maintains proper stack trace for where our error was thrown
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    /**
     * Get user-friendly error message
     */
    public getUserMessage(): string {
        return this.message;
    }

    /**
     * Get detailed error information
     */
    public getDetails(): ErrorDetails {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            category: this.category,
            severity: this.severity,
            recovery: this.recovery,
            context: this.context,
            stack: this.stack
        };
    }
}

/**
 * Error Categories
 */
export enum ErrorCategory {
    VALIDATION = 'VALIDATION',
    COMPOSITION = 'COMPOSITION',
    ENHANCEMENT = 'ENHANCEMENT',
    CACHE = 'CACHE',
    PERFORMANCE = 'PERFORMANCE',
    CONFIGURATION = 'CONFIGURATION',
    DEPENDENCY = 'DEPENDENCY'
}

/**
 * Error Severity Levels
 */
export enum ErrorSeverity {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL'
}

/**
 * Recovery Strategies
 */
export enum RecoveryStrategy {
    RETRY = 'RETRY',
    FALLBACK = 'FALLBACK',
    USER_ACTION = 'USER_ACTION',
    RESTART = 'RESTART',
    IGNORE = 'IGNORE'
}

/**
 * Error Details Interface
 */
export interface ErrorDetails {
    name: string;
    message: string;
    code: string;
    category: ErrorCategory;
    severity: ErrorSeverity;
    recovery?: RecoveryStrategy;
    context?: Record<string, unknown>;
    stack?: string;
}

/**
 * Theme Not Found Error
 * 
 * Single Responsibility: Handles missing theme variants
 */
export class ThemeNotFoundError extends ThemeError {
    constructor(
        public readonly variant: string,
        public readonly availableVariants: string[]
    ) {
        const message = `Theme "${variant}" not found. Available variants: ${availableVariants.join(', ')}`;
        const code = 'THEME_001';
        const category = ErrorCategory.VALIDATION;
        const severity = ErrorSeverity.HIGH;
        const recovery = RecoveryStrategy.USER_ACTION;
        const context = { variant, availableVariants };

        super(message, code, category, severity, recovery, context);
    }
}

/**
 * Theme Validation Error
 * 
 * Single Responsibility: Handles theme validation failures
 */
export class ThemeValidationError extends ThemeError {
    constructor(
        public readonly errors: string[],
        public readonly warnings: string[] = []
    ) {
        const message = `Theme validation failed: ${errors.join(', ')}`;
        const code = 'THEME_002';
        const category = ErrorCategory.VALIDATION;
        const severity = ErrorSeverity.MEDIUM;
        const recovery = RecoveryStrategy.USER_ACTION;
        const context = { errors, warnings };

        super(message, code, category, severity, recovery, context);
    }
}

/**
 * Theme Composition Error
 * 
 * Single Responsibility: Handles theme composition failures
 */
export class ThemeCompositionError extends ThemeError {
    constructor(
        message: string,
        public readonly themeName: string,
        public readonly operation: string
    ) {
        const code = 'THEME_003';
        const category = ErrorCategory.COMPOSITION;
        const severity = ErrorSeverity.HIGH;
        const recovery = RecoveryStrategy.FALLBACK;
        const context = { themeName, operation };

        super(message, code, category, severity, recovery, context);
    }
}

/**
 * Theme Enhancement Error
 * 
 * Single Responsibility: Handles theme enhancement failures
 */
export class ThemeEnhancementError extends ThemeError {
    constructor(
        message: string,
        public readonly themeName: string,
        public readonly enhancementType: string
    ) {
        const code = 'THEME_004';
        const category = ErrorCategory.ENHANCEMENT;
        const severity = ErrorSeverity.MEDIUM;
        const recovery = RecoveryStrategy.FALLBACK;
        const context = { themeName, enhancementType };

        super(message, code, category, severity, recovery, context);
    }
}

/**
 * Cache Error
 * 
 * Single Responsibility: Handles caching-related errors
 */
export class ThemeCacheError extends ThemeError {
    constructor(
        message: string,
        public readonly operation: string,
        public readonly cacheKey?: string
    ) {
        const code = 'THEME_005';
        const category = ErrorCategory.CACHE;
        const severity = ErrorSeverity.LOW;
        const recovery = RecoveryStrategy.RETRY;
        const context = { operation, cacheKey };

        super(message, code, category, severity, recovery, context);
    }
}

/**
 * Performance Error
 * 
 * Single Responsibility: Handles performance-related issues
 */
export class ThemePerformanceError extends ThemeError {
    constructor(
        message: string,
        public readonly operation: string,
        public readonly duration: number,
        public readonly threshold: number
    ) {
        const code = 'THEME_006';
        const category = ErrorCategory.PERFORMANCE;
        const severity = ErrorSeverity.MEDIUM;
        const recovery = RecoveryStrategy.IGNORE;
        const context = { operation, duration, threshold };

        super(message, code, category, severity, recovery, context);
    }
}

/**
 * Configuration Error
 * 
 * Single Responsibility: Handles configuration-related errors
 */
export class ThemeConfigurationError extends ThemeError {
    constructor(
        message: string,
        public readonly configPath: string,
        public readonly invalidValue?: unknown
    ) {
        const code = 'THEME_007';
        const category = ErrorCategory.CONFIGURATION;
        const severity = ErrorSeverity.HIGH;
        const recovery = RecoveryStrategy.USER_ACTION;
        const context = { configPath, invalidValue };

        super(message, code, category, severity, recovery, context);
    }
}

/**
 * Dependency Error
 * 
 * Single Responsibility: Handles dependency injection errors
 */
export class ThemeDependencyError extends ThemeError {
    constructor(
        message: string,
        public readonly dependency: string,
        public readonly requiredBy: string
    ) {
        const code = 'THEME_008';
        const category = ErrorCategory.DEPENDENCY;
        const severity = ErrorSeverity.CRITICAL;
        const recovery = RecoveryStrategy.RESTART;
        const context = { dependency, requiredBy };

        super(message, code, category, severity, recovery, context);
    }
}

/**
 * Error Factory Interface - Dependency Inversion Principle
 */
export interface IThemeErrorFactory {
    createThemeNotFoundError(variant: string, availableVariants: string[]): ThemeNotFoundError;
    createValidationError(errors: string[], warnings?: string[]): ThemeValidationError;
    createCompositionError(message: string, themeName: string, operation: string): ThemeCompositionError;
    createEnhancementError(message: string, themeName: string, enhancementType: string): ThemeEnhancementError;
    createCacheError(message: string, operation: string, cacheKey?: string): ThemeCacheError;
    createPerformanceError(message: string, operation: string, duration: number, threshold: number): ThemePerformanceError;
    createConfigurationError(message: string, configPath: string, invalidValue?: unknown): ThemeConfigurationError;
    createDependencyError(message: string, dependency: string, requiredBy: string): ThemeDependencyError;
}

/**
 * Theme Error Factory Implementation
 * 
 * Single Responsibility: Creates theme error instances
 * Open/Closed: Extensible through interface
 * Liskov Substitution: Can be substituted with mock implementations
 * Interface Segregation: Focused interface for error creation
 * Dependency Inversion: No dependencies on concrete implementations
 */
export class ThemeErrorFactory implements IThemeErrorFactory {
    private static instance: ThemeErrorFactory;

    private constructor() {}

    /**
     * Get singleton instance
     */
    public static getInstance(): ThemeErrorFactory {
        if (!ThemeErrorFactory.instance) {
            ThemeErrorFactory.instance = new ThemeErrorFactory();
        }
        return ThemeErrorFactory.instance;
    }

    /**
     * Create theme not found error
     */
    public createThemeNotFoundError(variant: string, availableVariants: string[]): ThemeNotFoundError {
        return new ThemeNotFoundError(variant, availableVariants);
    }

    /**
     * Create validation error
     */
    public createValidationError(errors: string[], warnings?: string[]): ThemeValidationError {
        return new ThemeValidationError(errors, warnings);
    }

    /**
     * Create composition error
     */
    public createCompositionError(message: string, themeName: string, operation: string): ThemeCompositionError {
        return new ThemeCompositionError(message, themeName, operation);
    }

    /**
     * Create enhancement error
     */
    public createEnhancementError(message: string, themeName: string, enhancementType: string): ThemeEnhancementError {
        return new ThemeEnhancementError(message, themeName, enhancementType);
    }

    /**
     * Create cache error
     */
    public createCacheError(message: string, operation: string, cacheKey?: string): ThemeCacheError {
        return new ThemeCacheError(message, operation, cacheKey);
    }

    /**
     * Create performance error
     */
    public createPerformanceError(message: string, operation: string, duration: number, threshold: number): ThemePerformanceError {
        return new ThemePerformanceError(message, operation, duration, threshold);
    }

    /**
     * Create configuration error
     */
    public createConfigurationError(message: string, configPath: string, invalidValue?: unknown): ThemeConfigurationError {
        return new ThemeConfigurationError(message, configPath, invalidValue);
    }

    /**
     * Create dependency error
     */
    public createDependencyError(message: string, dependency: string, requiredBy: string): ThemeDependencyError {
        return new ThemeDependencyError(message, dependency, requiredBy);
    }
}

/**
 * Export singleton instance for convenience
 */
export const themeErrorFactory = ThemeErrorFactory.getInstance();
