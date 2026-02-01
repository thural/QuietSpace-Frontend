/**
 * Services System Interfaces
 *
 * Centralized interface definitions for the services system.
 * Provides clean type exports following Black Box pattern.
 */

// Core service interfaces
export interface ILoggerService {
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, error?: Error, ...args: any[]): void;
    fatal(message: string, error?: Error, ...args: any[]): void;
    trace(message: string, ...args: any[]): void;
    setLevel(level: LogLevel): void;
    getLevel(): LogLevel;
    isLevelEnabled(level: LogLevel): boolean;
    createChildLogger(name: string): ILoggerService;
    withContext(context: LogContext): ILoggerService;
}

export interface IServiceContainer {
    register<T>(identifier: ServiceIdentifier, factory: ServiceFactory<T>): void;
    registerSingleton<T>(identifier: ServiceIdentifier, factory: ServiceFactory<T>): void;
    get<T>(identifier: ServiceIdentifier): T;
    getOptional<T>(identifier: ServiceIdentifier): T | null;
    has(identifier: ServiceIdentifier): boolean;
    clear(): void;
    createScope(): IServiceContainer;
    dispose(): void;
}

export interface IServiceFactory {
    create<T>(identifier: ServiceIdentifier): T;
    createAll<T>(identifiers: ServiceIdentifier[]): Record<string, T>;
    dispose(): void;
}

// Logger configuration interfaces
export interface ILoggerConfig {
    level: LogLevel;
    enableConsole: boolean;
    enableFile: boolean;
    enableRemote: boolean;
    filePath?: string;
    fileName?: string;
    fileMaxSize?: number;
    fileMaxFiles?: number;
    remoteEndpoint?: string;
    remoteApiKey?: string;
    bufferSize?: number;
    flushInterval?: number;
    enableColors?: boolean;
    enableTimestamps?: boolean;
    enableMetadata?: boolean;
    enablePerformance?: boolean;
    enableSourceMaps?: boolean;
    enableStackTrace?: boolean;
    format?: LogFormat;
    filters?: LogFilter[];
    transports?: LogTransport[];
}

export interface LogContext {
    userId?: string;
    sessionId?: string;
    requestId?: string;
    correlationId?: string;
    component?: string;
    action?: string;
    metadata?: Record<string, any>;
}

export interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: number;
    context?: LogContext;
    error?: Error;
    args?: any[];
    stack?: string;
    source?: string;
    metadata?: Record<string, any>;
}

// Log level and format interfaces
export enum LogLevel {
    TRACE = 0,
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
    FATAL = 5
}

export enum LogFormat {
    JSON = 'json',
    TEXT = 'text',
    PRETTY = 'pretty',
    STRUCTURED = 'structured'
}

export interface LogFilter {
    level: LogLevel;
    context?: Partial<LogContext>;
    message?: string;
    component?: string;
    enabled: boolean;
}

export interface LogTransport {
    name: string;
    level: LogLevel;
    format: LogFormat;
    enabled: boolean;
    write(entry: LogEntry): Promise<void> | void;
    flush?(): Promise<void> | void;
    close?(): Promise<void> | void;
}

// Transport interfaces
export interface IConsoleTransport extends LogTransport {
    useColors: boolean;
    showTimestamps: boolean;
    showMetadata: boolean;
}

export interface IFileTransport extends LogTransport {
    filePath: string;
    fileName: string;
    maxSize: number;
    maxFiles: number;
    compress: boolean;
    rotateOnStart: boolean;
}

export interface IRemoteTransport extends LogTransport {
    endpoint: string;
    apiKey?: string;
    batchSize: number;
    flushInterval: number;
    timeout: number;
    retryAttempts: number;
    headers?: Record<string, string>;
}

// Service container interfaces
export interface ServiceDescriptor<T = any> {
    identifier: ServiceIdentifier;
    factory: ServiceFactory<T>;
    singleton?: boolean;
    dependencies?: ServiceIdentifier[];
    lifecycle?: ServiceLifecycle;
    metadata?: ServiceMetadata;
}

export type ServiceFactory<T = any> = (...args: any[]) => T;

export interface ServiceLifecycle<T = any> {
    onCreate?(instance: T): void;
    onDestroy?(instance: T): void;
    onDispose?(instance: T): void;
}

export interface ServiceMetadata {
    name?: string;
    version?: string;
    description?: string;
    tags?: string[];
    author?: string;
    created?: Date;
    modified?: Date;
}

// Service identifier types
export type ServiceIdentifier = string | symbol | (new (...args: any[]) => any);

// Service scope interfaces
export interface IServiceScope {
    get<T>(identifier: ServiceIdentifier): T;
    getOptional<T>(identifier: ServiceIdentifier): T | null;
    has(identifier: ServiceIdentifier): boolean;
    register<T>(identifier: ServiceIdentifier, factory: ServiceFactory<T>): void;
    registerSingleton<T>(identifier: ServiceIdentifier, factory: ServiceFactory<T>): void;
    dispose(): void;
    getParent(): IServiceScope | null;
    getChild(name: string): IServiceScope;
}

// Service registry interfaces
export interface IServiceRegistry {
    register(descriptor: ServiceDescriptor): void;
    unregister(identifier: ServiceIdentifier): void;
    get(identifier: ServiceIdentifier): ServiceDescriptor | null;
    getAll(): ServiceDescriptor[];
    clear(): void;
    has(identifier: ServiceIdentifier): boolean;
    findByTag(tag: string): ServiceDescriptor[];
    findByMetadata(key: string, value: any): ServiceDescriptor[];
}

// Service factory interfaces
export interface IServiceFactory {
    create<T>(identifier: ServiceIdentifier, container: IServiceContainer): T;
    createAll<T>(identifiers: ServiceIdentifier[], container: IServiceContainer): Record<string, T>;
    dispose(): void;
}

// Service health interfaces
export interface IServiceHealthChecker {
    checkHealth(): Promise<ServiceHealthStatus>;
    startHealthCheck(interval: number): void;
    stopHealthCheck(): void;
    isHealthy(): boolean;
    getLastCheck(): Date;
}

export interface ServiceHealthStatus {
    status: 'healthy' | 'unhealthy' | 'degraded' | 'unknown';
    checks: ServiceHealthCheck[];
    overallScore: number;
    lastCheck: Date;
    issues: string[];
    recommendations: string[];
}

export interface ServiceHealthCheck {
    name: string;
    status: 'pass' | 'fail' | 'warn' | 'skip';
    score: number;
    message: string;
    duration?: number;
    metadata?: Record<string, any>;
    error?: Error;
}

// Service monitoring interfaces
export interface IServiceMonitor {
    startMonitoring(): void;
    stopMonitoring(): void;
    getMetrics(): ServiceMetrics;
    enableMetrics(enabled: boolean): void;
    setMetricsInterval(interval: number): void;
    addCustomMetric(name: string, collector: MetricCollector): void;
    removeCustomMetric(name: string): void;
}

export interface ServiceMetrics {
    uptime: number;
    memoryUsage: number;
    cpuUsage: number;
    requestCount: number;
    errorCount: number;
    averageResponseTime: number;
    lastActivity: Date;
    customMetrics: Record<string, any>;
    lastReset: Date;
}

export interface MetricCollector {
    collect(): any;
    reset(): void;
}

// Service plugin interfaces
export interface IServicePlugin {
    name: string;
    version: string;
    dependencies?: string[];
    install(container: IServiceContainer): Promise<void> | void;
    uninstall(container: IServiceContainer): Promise<void> | void;
    isCompatible(version: string): boolean;
}

// Service middleware interfaces
export interface IServiceMiddleware {
    name: string;
    priority: number;
    execute(context: ServiceContext, next: () => Promise<any>): Promise<any>;
}

export interface ServiceContext {
    service: any;
    identifier: ServiceIdentifier;
    method: string;
    args: any[];
    metadata?: Record<string, any>;
}

// Service configuration interfaces
export interface ServiceConfig {
    services?: Record<string, ServiceDescriptor>;
    defaultScope?: string;
    enableAutoRegistration?: boolean;
    enableDependencyResolution?: boolean;
    enableCircularDependencyDetection?: boolean;
    enablePerformanceMonitoring?: boolean;
    enableHealthChecks?: boolean;
    healthCheckInterval?: number;
    metricsInterval?: number;
}

// Service validation interfaces
export interface IServiceValidator {
    validate(descriptor: ServiceDescriptor): ValidationResult;
    validateDependencies(dependencies: ServiceIdentifier[]): ValidationResult;
    validateFactory(factory: ServiceFactory): ValidationResult;
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    recommendations: string[];
}

// Service configuration presets
export const DEFAULT_LOGGER_CONFIG: ILoggerConfig = {
    level: LogLevel.INFO,
    enableConsole: true,
    enableFile: false,
    enableRemote: false,
    bufferSize: 1000,
    flushInterval: 5000,
    enableColors: true,
    enableTimestamps: true,
    enableMetadata: true,
    format: LogFormat.PRETTY
};

export const DEVELOPMENT_LOGGER_CONFIG: ILoggerConfig = {
    ...DEFAULT_LOGGER_CONFIG,
    level: LogLevel.DEBUG,
    enableFile: true,
    enableColors: true,
    enableStackTrace: true,
    enableSourceMaps: true
};

export const PRODUCTION_LOGGER_CONFIG: ILoggerConfig = {
    ...DEFAULT_LOGGER_CONFIG,
    level: LogLevel.WARN,
    enableFile: true,
    enableRemote: true,
    enableColors: false,
    enableStackTrace: false,
    enableSourceMaps: false
};

export const TEST_LOGGER_CONFIG: ILoggerConfig = {
    ...DEFAULT_LOGGER_CONFIG,
    level: LogLevel.DEBUG,
    enableConsole: false,
    enableFile: false,
    enableRemote: false,
    enableColors: false,
    enableTimestamps: true,
    enableMetadata: false
};

// Service validation rules
export const SERVICE_VALIDATION_RULES = {
    identifier: {
        required: true,
        type: ['string', 'symbol', 'function'],
        maxLength: 255
    },
    factory: {
        required: true,
        type: 'function'
    },
    dependencies: {
        required: false,
        type: 'array',
        maxItems: 10
    },
    metadata: {
        required: false,
        type: 'object',
        maxKeys: 20
    }
};

// Service error types
export enum ServiceErrorType {
    SERVICE_NOT_FOUND = 'SERVICE_NOT_FOUND',
    SERVICE_CREATION_FAILED = 'SERVICE_CREATION_FAILED',
    SERVICE_DISPOSAL_FAILED = 'SERVICE_DISPOSAL_FAILED',
    CIRCULAR_DEPENDENCY = 'CIRCULAR_DEPENDENCY',
    INVALID_DEPENDENCY = 'INVALID_DEPENDENCY',
    INVALID_FACTORY = 'INVALID_FACTORY',
    INVALID_IDENTIFIER = 'INVALID_IDENTIFIER',
    CONTAINER_DISPOSED = 'CONTAINER_DISPOSED',
    SCOPE_DISPOSED = 'SCOPE_DISPOSED',
    REGISTRATION_FAILED = 'REGISTRATION_FAILED',
    UNREGISTRATION_FAILED = 'UNREGISTRATION_FAILED'
}

export interface ServiceError extends Error {
    type: ServiceErrorType;
    identifier?: ServiceIdentifier;
    timestamp: number;
    metadata?: Record<string, any>;
}

// Utility types
export type LogLevelName = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type LogLevelValue = 0 | 1 | 2 | 3 | 4 | 5;

export type ServiceIdentifierMap<T = any> = Record<string, T>;
export type ServiceFactoryMap<T = any> = Record<string, ServiceFactory<T>>;
export type ServiceDescriptorMap = Record<string, ServiceDescriptor>;

// Helper functions
export function createServiceDescriptor<T>(
    identifier: ServiceIdentifier,
    factory: ServiceFactory<T>,
    options?: {
        singleton?: boolean;
        dependencies?: ServiceIdentifier[];
        lifecycle?: ServiceLifecycle;
        metadata?: ServiceMetadata;
    }
): ServiceDescriptor<T> {
    return {
        identifier,
        factory,
        singleton: options?.singleton,
        dependencies: options?.dependencies,
        lifecycle: options?.lifecycle,
        metadata: options?.metadata
    };
}

export function createLogContext(context?: Partial<LogContext>): LogContext {
    return {
        ...context
    };
}

export function createLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error,
    args?: any[]
): LogEntry {
    return {
        level,
        message,
        timestamp: Date.now(),
        context,
        error,
        args,
        stack: error?.stack,
        metadata: context?.metadata
    };
}
