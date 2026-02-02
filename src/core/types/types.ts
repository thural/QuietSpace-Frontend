/**
 * Core System Types
 *
 * Centralized type definitions for all core system interfaces.
 * Provides clean type exports following Black Box pattern.
 */

// Basic Core Interfaces
export interface ICacheService {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
    has(key: string): Promise<boolean>;
    getStats(): CacheStats;
}

export interface ICacheServiceManager extends ICacheService {
    createCache(config?: CacheConfig): ICacheService;
    getCache(name: string): ICacheService | null;
    removeCache(name: string): void;
    clearAll(): void;
    getAllStats(): Record<string, CacheStats>;
}

export interface IWebSocketService {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    send(message: WebSocketMessage): Promise<void>;
    subscribe(event: string, handler: (message: WebSocketMessage) => void): () => void;
    isConnected(): boolean;
    getState(): WebSocketState;
}

export interface IAuthService {
    authenticate(credentials: AuthCredentials): Promise<AuthResult<AuthSession>>;
    register(userData: AuthCredentials): Promise<AuthResult<void>>;
    logout(): Promise<AuthResult<void>>;
    refreshToken(refreshToken: string): Promise<AuthResult<AuthToken>>;
    validateToken(token: string): Promise<AuthResult<boolean>>;
    getCurrentUser(): Promise<AuthResult<AuthUser>>;
}

export interface IThemeService {
    getTheme(): EnhancedTheme;
    setTheme(theme: EnhancedTheme): void;
    createTheme(config: ThemeConfig): EnhancedTheme;
    getTokens(): ThemeTokens;
    switchTheme(name: string): void;
}

export interface ILoggerService {
    debug(message: string, ...args: unknown[]): void;
    info(message: string, ...args: unknown[]): void;
    warn(message: string, ...args: unknown[]): void;
    error(message: string, error?: Error, ...args: unknown[]): void;
    setLevel(level: LogLevel): void;
    getLevel(): LogLevel;
}

export interface INetworkService {
    get<T>(url: string, config?: unknown): Promise<ApiResponse<T>>;
    post<T>(url: string, data?: unknown, config?: unknown): Promise<ApiResponse<T>>;
    put<T>(url: string, data?: unknown, config?: unknown): Promise<ApiResponse<T>>;
    delete<T>(url: string, config?: unknown): Promise<ApiResponse<T>>;
    setAuth(token: string): void;
    clearAuth(): void;
}

export interface IServiceContainer {
    register<T>(identifier: ServiceIdentifier, factory: ServiceFactory<T>): void;
    get<T>(identifier: ServiceIdentifier): T;
    has(identifier: ServiceIdentifier): boolean;
    clear(): void;
}

// Core System Composite Types
export interface ICoreServices {
    cache: ICacheServiceManager;
    websocket: IWebSocketService;
    auth: IAuthService;
    theme: IThemeService;
    services: ILoggerService;
    network: INetworkService;
    container: IServiceContainer;
}

// Data Types
export interface CacheEntry<T = unknown> {
    key: string;
    value: T;
    timestamp: number;
    ttl?: number;
    expiresAt?: number;
}

export interface CacheStats {
    size: number;
    hits: number;
    misses: number;
    hitRate: number;
    memoryUsage: number;
}

export interface CacheConfig {
    maxSize?: number;
    defaultTtl?: number;
    strategy?: 'lru' | 'fifo' | 'lfu';
    enableMetrics?: boolean;
}

export interface WebSocketMessage {
    type: string;
    data: unknown;
    timestamp: number;
    id?: string;
}

export interface WebSocketConfig {
    url: string;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
    timeout?: number;
    protocols?: string[];
}

export enum WebSocketState {
    DISCONNECTED = 'disconnected',
    CONNECTING = 'connecting',
    CONNECTED = 'connected',
    RECONNECTING = 'reconnecting',
    ERROR = 'error'
}

export interface AuthCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface AuthUser {
    id: string;
    email: string;
    username: string;
    roles: string[];
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthToken {
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    tokenType: string;
}

export interface AuthSession {
    user: AuthUser;
    token: AuthToken;
    provider: string;
    createdAt: Date;
    expiresAt: Date;
    isActive: boolean;
}

export interface AuthResult<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        type: string;
        message: string;
        code?: string;
        details?: Record<string, unknown>;
    };
}

export interface ThemeConfig {
    name: string;
    colors?: Record<string, string>;
    typography?: Record<string, unknown>;
    spacing?: Record<string, string>;
    shadows?: Record<string, string>;
}

export interface ThemeTokens {
    colors: Record<string, string>;
    typography: Record<string, unknown>;
    spacing: Record<string, string>;
    shadows: Record<string, string>;
    breakpoints: Record<string, string>;
    radius: Record<string, string>;
}

export interface EnhancedTheme extends ThemeTokens {
    getSpacing: (key: string) => string;
    getColor: (path: string) => string;
    getTypography: (key: string) => unknown;
}

export interface ApiResponse<T = unknown> {
    data?: T;
    success: boolean;
    message?: string;
    error?: string;
    status?: number;
    headers?: Record<string, string>;
}

export interface ApiError {
    message: string;
    status?: number;
    code?: string;
    details?: Record<string, unknown>;
}

export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error'
}

export interface IServiceConfig {
    level?: LogLevel;
    enableConsole?: boolean;
    enableFile?: boolean;
    enableRemote?: boolean;
}

// DI Types
export type ServiceIdentifier = string | symbol | (new (...args: unknown[]) => unknown);
export type ServiceFactory<T> = (...args: unknown[]) => T;
export type ServiceDescriptor<T = unknown> = {
    identifier: ServiceIdentifier;
    factory: ServiceFactory<T>;
    singleton?: boolean;
    dependencies?: ServiceIdentifier[];
};

// Core System Configuration
export interface CoreConfig {
    cache?: CacheConfig;
    websocket?: WebSocketConfig;
    theme?: ThemeConfig;
    network?: unknown;
    services?: IServiceConfig;
}

// Core System Events
export interface CoreSystemEvent {
    type: string;
    payload: unknown;
    timestamp: Date;
}

// Core System Status
export interface CoreSystemStatus {
    initialized: boolean;
    services: Record<string, boolean>;
    errors: string[];
    lastUpdated: Date;
}
