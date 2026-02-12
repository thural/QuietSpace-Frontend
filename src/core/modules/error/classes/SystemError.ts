/**
 * System Error Classes
 * 
 * Error classes for system and infrastructure related issues.
 */

import { BaseError } from './BaseError';
import { ErrorCategory, ErrorSeverity, ErrorRecoveryStrategy } from '../types/index';

/**
 * Base system error class
 */
export class SystemError extends BaseError {
    public readonly component?: string;
    public readonly operation?: string;
    public readonly systemCode?: string;
    public readonly resource?: string;

    constructor(
        message: string,
        code: string = 'SYSTEM_ERROR',
        component?: string,
        operation?: string,
        options: {
            severity?: ErrorSeverity;
            recoverable?: boolean;
            recoveryStrategy?: ErrorRecoveryStrategy;
            userMessage?: string;
            suggestedActions?: string[];
            metadata?: Record<string, any>;
            cause?: Error;
            context?: any;
            systemCode?: string;
            resource?: string;
        } = {}
    ) {
        const {
            severity = ErrorSeverity.HIGH,
            recoverable = true,
            recoveryStrategy = ErrorRecoveryStrategy.DELAYED,
            userMessage,
            suggestedActions = [],
            metadata = {},
            cause,
            context,
            systemCode,
            resource
        } = options;

        super(
            message,
            code,
            ErrorCategory.SYSTEM,
            severity,
            recoverable,
            recoveryStrategy,
            userMessage || 'System error occurred',
            suggestedActions,
            { ...metadata, component, operation, systemCode, resource },
            cause,
            context
        );

        this.component = component;
        this.operation = operation;
        this.systemCode = systemCode;
        this.resource = resource;
    }
}

/**
 * Memory error
 */
export class MemoryError extends SystemError {
    public readonly memoryUsage?: number;
    public readonly memoryLimit?: number;

    constructor(
        message: string = 'System memory error',
        memoryUsage?: number,
        memoryLimit?: number,
        options: {
            cause?: Error;
            context?: any;
        } = {}
    ) {
        const { cause, context } = options;

        super(
            message,
            'MEMORY_ERROR',
            'MemoryManager',
            'allocation',
            {
                severity: ErrorSeverity.HIGH,
                recoverable: true,
                recoveryStrategy: ErrorRecoveryStrategy.AUTOMATIC,
                userMessage: 'System is running low on memory',
                suggestedActions: [
                    'Close unnecessary tabs',
                    'Refresh the page',
                    'Restart your browser',
                    'Contact support if issue persists'
                ],
                metadata: { memoryUsage, memoryLimit },
                cause,
                context
            }
        );

        this.memoryUsage = memoryUsage;
        this.memoryLimit = memoryLimit;
    }

    /**
     * Get memory usage percentage
     */
    public getMemoryUsagePercentage(): number {
        if (!this.memoryUsage || !this.memoryLimit) return 0;
        return (this.memoryUsage / this.memoryLimit) * 100;
    }

    /**
     * Check if memory usage is critical
     */
    public isCritical(): boolean {
        return this.getMemoryUsagePercentage() > 90;
    }
}

/**
 * Disk space error
 */
export class DiskSpaceError extends SystemError {
    public readonly availableSpace?: number;
    public readonly requiredSpace?: number;
    public readonly location?: string;

    constructor(
        message: string = 'Insufficient disk space',
        availableSpace?: number,
        requiredSpace?: number,
        location?: string,
        options: {
            cause?: Error;
            context?: any;
        } = {}
    ) {
        const { cause, context } = options;

        super(
            message,
            'DISK_SPACE_ERROR',
            'FileSystem',
            'write',
            {
                severity: ErrorSeverity.HIGH,
                recoverable: true,
                recoveryStrategy: ErrorRecoveryStrategy.MANUAL,
                userMessage: 'Not enough disk space available',
                suggestedActions: [
                    'Free up disk space',
                    'Clear browser cache',
                    'Remove unnecessary files',
                    'Contact support if issue persists'
                ],
                metadata: { availableSpace, requiredSpace, location },
                cause,
                context
            }
        );

        this.availableSpace = availableSpace;
        this.requiredSpace = requiredSpace;
        this.location = location;
    }

    /**
     * Get space shortage in bytes
     */
    public getSpaceShortage(): number {
        if (!this.availableSpace || !this.requiredSpace) return 0;
        return Math.max(0, this.requiredSpace - this.availableSpace);
    }
}

/**
 * CPU error
 */
export class CPUError extends SystemError {
    public readonly cpuUsage?: number;
    public readonly maxUsage?: number;
    public readonly duration?: number;

    constructor(
        message: string = 'CPU usage error',
        cpuUsage?: number,
        maxUsage?: number,
        duration?: number,
        options: {
            cause?: Error;
            context?: any;
        } = {}
    ) {
        const { cause, context } = options;

        super(
            message,
            'CPU_ERROR',
            'CPUManager',
            'processing',
            {
                severity: ErrorSeverity.MEDIUM,
                recoverable: true,
                recoveryStrategy: ErrorRecoveryStrategy.AUTOMATIC,
                userMessage: 'System is experiencing high CPU usage',
                suggestedActions: [
                    'Wait for current operations to complete',
                    'Close unnecessary applications',
                    'Refresh the page',
                    'Contact support if issue persists'
                ],
                metadata: { cpuUsage, maxUsage, duration },
                cause,
                context
            }
        );

        this.cpuUsage = cpuUsage;
        this.maxUsage = maxUsage;
        this.duration = duration;
    }

    /**
     * Check if CPU usage is critical
     */
    public isCritical(): boolean {
        if (!this.cpuUsage || !this.maxUsage) return false;
        return (this.cpuUsage / this.maxUsage) > 0.9;
    }
}

/**
 * Database error
 */
export class DatabaseError extends SystemError {
    public readonly database?: string;
    public readonly query?: string;
    public readonly connectionId?: string;

    constructor(
        message: string = 'Database error occurred',
        database?: string,
        query?: string,
        connectionId?: string,
        options: {
            severity?: ErrorSeverity;
            recoverable?: boolean;
            cause?: Error;
            context?: any;
        } = {}
    ) {
        const { severity = ErrorSeverity.HIGH, recoverable = true, cause, context } = options;

        super(
            message,
            'DATABASE_ERROR',
            'DatabaseManager',
            'query',
            {
                severity,
                recoverable,
                recoveryStrategy: ErrorRecoveryStrategy.DELAYED,
                userMessage: 'Database operation failed',
                suggestedActions: [
                    'Try again later',
                    'Check your internet connection',
                    'Contact support if issue persists'
                ],
                metadata: { database, query, connectionId },
                cause,
                context
            }
        );

        this.database = database;
        this.query = query;
        this.connectionId = connectionId;
    }
}

/**
 * File system error
 */
export class FileSystemError extends SystemError {
    public readonly filePath?: string;
    public readonly operation?: string;
    public readonly permissions?: string;

    constructor(
        message: string = 'File system error',
        filePath?: string,
        operation?: string,
        permissions?: string,
        options: {
            cause?: Error;
            context?: any;
        } = {}
    ) {
        const { cause, context } = options;

        super(
            message,
            'FILE_SYSTEM_ERROR',
            'FileSystem',
            operation,
            {
                severity: ErrorSeverity.MEDIUM,
                recoverable: true,
                recoveryStrategy: ErrorRecoveryStrategy.MANUAL,
                userMessage: 'File system operation failed',
                suggestedActions: [
                    'Check file permissions',
                    'Ensure file exists',
                    'Try a different location',
                    'Contact support if issue persists'
                ],
                metadata: { filePath, operation, permissions },
                cause,
                context
            }
        );

        this.filePath = filePath;
        this.operation = operation;
        this.permissions = permissions;
    }
}

/**
 * Configuration error
 */
export class ConfigurationError extends SystemError {
    public readonly configKey?: string;
    public readonly configValue?: any;
    public readonly expectedType?: string;

    constructor(
        message: string = 'Configuration error',
        configKey?: string,
        configValue?: any,
        expectedType?: string,
        options: {
            cause?: Error;
            context?: any;
        } = {}
    ) {
        const { cause, context } = options;

        super(
            message,
            'CONFIGURATION_ERROR',
            'ConfigurationManager',
            'load',
            {
                severity: ErrorSeverity.HIGH,
                recoverable: false,
                recoveryStrategy: ErrorRecoveryStrategy.NONE,
                userMessage: 'System configuration error',
                suggestedActions: [
                    'Check configuration settings',
                    'Contact your administrator',
                    'Restart the application',
                    'Contact support if issue persists'
                ],
                metadata: { configKey, configValue, expectedType },
                cause,
                context
            }
        );

        this.configKey = configKey;
        this.configValue = configValue;
        this.expectedType = expectedType;
    }
}

/**
 * Dependency error
 */
export class DependencyError extends SystemError {
    public readonly dependency?: string;
    public readonly version?: string;
    public readonly requiredVersion?: string;

    constructor(
        message: string = 'Dependency error',
        dependency?: string,
        version?: string,
        requiredVersion?: string,
        options: {
            cause?: Error;
            context?: any;
        } = {}
    ) {
        const { cause, context } = options;

        super(
            message,
            'DEPENDENCY_ERROR',
            'DependencyManager',
            'load',
            {
                severity: ErrorSeverity.HIGH,
                recoverable: true,
                recoveryStrategy: ErrorRecoveryStrategy.AUTOMATIC,
                userMessage: 'Required system component failed to load',
                suggestedActions: [
                    'Refresh the page',
                    'Clear browser cache',
                    'Check for updates',
                    'Contact support if issue persists'
                ],
                metadata: { dependency, version, requiredVersion },
                cause,
                context
            }
        );

        this.dependency = dependency;
        this.version = version;
        this.requiredVersion = requiredVersion;
    }

    /**
     * Check if version mismatch exists
     */
    public hasVersionMismatch(): boolean {
        return this.version !== undefined &&
            this.requiredVersion !== undefined &&
            this.version !== this.requiredVersion;
    }
}
