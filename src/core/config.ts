/**
 * Core System Configuration Types
 * 
 * Configuration interfaces and types for the core system.
 * Provides clean type exports following Black Box pattern.
 */

export interface CoreConfig {
    cache?: CacheConfig;
    websocket?: WebSocketConfig;
    auth?: AuthConfig;
    theme?: ThemeConfig;
    network?: NetworkConfig;
    services?: ServiceConfig;
}

export interface CacheConfig {
    maxSize?: number;
    defaultTtl?: number;
    strategy?: 'lru' | 'fifo' | 'lfu';
    enableMetrics?: boolean;
}

export interface WebSocketConfig {
    url?: string;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
    timeout?: number;
    protocols?: string[];
}

export interface AuthConfig {
    tokenRefreshInterval?: number;
    sessionTimeout?: number;
    maxLoginAttempts?: number;
    enableTwoFactorAuth?: boolean;
    passwordMinLength?: number;
    requireEmailVerification?: boolean;
    enableSocialLogin?: boolean;
    socialProviders?: string[];
}

export interface ThemeConfig {
    name: string;
    variant?: string;
    colors?: Record<string, string>;
    typography?: Record<string, any>;
    spacing?: Record<string, string>;
    shadows?: Record<string, string>;
}

export interface NetworkConfig {
    baseURL?: string;
    timeout?: number;
    retryAttempts?: number;
    retryDelay?: number;
    enableAuth?: boolean;
    headers?: Record<string, string>;
}

export interface ServiceConfig {
    level?: 'debug' | 'info' | 'warn' | 'error';
    enableConsole?: boolean;
    enableFile?: boolean;
    enableRemote?: boolean;
    filePath?: string;
    remoteEndpoint?: string;
    bufferSize?: number;
    flushInterval?: number;
}

// Environment-specific configurations
export interface DevelopmentConfig extends CoreConfig {
    debug?: boolean;
    mockServices?: boolean;
    enableHotReload?: boolean;
    logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

export interface ProductionConfig extends CoreConfig {
    debug?: false;
    mockServices?: false;
    enableHotReload?: false;
    logLevel?: 'info' | 'warn' | 'error';
}

export interface TestConfig extends CoreConfig {
    debug?: true;
    mockServices?: true;
    enableHotReload?: false;
    logLevel?: 'debug';
    testTimeout?: number;
}

// Configuration validation rules
export interface ValidationRule {
    min: number;
    max: number;
}

export interface ValidationRules {
    cache: {
        maxSize: ValidationRule;
        defaultTtl: ValidationRule;
        strategy: string[];
    };
    websocket: {
        reconnectInterval: ValidationRule;
        maxReconnectAttempts: ValidationRule;
        timeout: ValidationRule;
    };
    auth: {
        tokenRefreshInterval: ValidationRule;
        sessionTimeout: ValidationRule;
        maxLoginAttempts: ValidationRule;
    };
    network: {
        timeout: ValidationRule;
        retryAttempts: ValidationRule;
        retryDelay: ValidationRule;
    };
}

// Configuration presets
export const DEFAULT_CONFIG: CoreConfig = {
    cache: {
        maxSize: 1000,
        defaultTtl: 3600000,
        strategy: 'lru',
        enableMetrics: true
    },
    websocket: {
        reconnectInterval: 3000,
        maxReconnectAttempts: 5,
        timeout: 10000
    },
    auth: {
        tokenRefreshInterval: 300000,
        sessionTimeout: 3600000,
        maxLoginAttempts: 5,
        enableTwoFactorAuth: false,
        passwordMinLength: 8,
        requireEmailVerification: true,
        enableSocialLogin: true,
        socialProviders: ['google', 'github', 'microsoft']
    },
    theme: {
        name: 'default',
        variant: 'light'
    },
    network: {
        timeout: 30000,
        retryAttempts: 3,
        retryDelay: 1000,
        enableAuth: true
    },
    services: {
        level: 'info',
        enableConsole: true,
        enableFile: false,
        enableRemote: false
    }
};

export const DEVELOPMENT_CONFIG: DevelopmentConfig = {
    ...DEFAULT_CONFIG,
    debug: true,
    mockServices: true,
    enableHotReload: true,
    logLevel: 'debug'
};

export const PRODUCTION_CONFIG: ProductionConfig = {
    ...DEFAULT_CONFIG,
    debug: false,
    mockServices: false,
    enableHotReload: false,
    logLevel: 'info'
};

export const TEST_CONFIG: TestConfig = {
    ...DEFAULT_CONFIG,
    debug: true,
    mockServices: true,
    enableHotReload: false,
    logLevel: 'debug',
    testTimeout: 5000
};

// Configuration factory functions
export function createCacheConfig(overrides?: Partial<CacheConfig>): CacheConfig {
    return { ...DEFAULT_CONFIG.cache, ...overrides };
}

export function createWebSocketConfig(overrides?: Partial<WebSocketConfig>): WebSocketConfig {
    return { ...DEFAULT_CONFIG.websocket, ...overrides };
}

export function createAuthConfig(overrides?: Partial<AuthConfig>): AuthConfig {
    return { ...DEFAULT_CONFIG.auth, ...overrides };
}

export function createThemeConfig(overrides?: Partial<ThemeConfig>): ThemeConfig {
    return { ...DEFAULT_CONFIG.theme, ...overrides };
}

export function createNetworkConfig(overrides?: Partial<NetworkConfig>): NetworkConfig {
    return { ...DEFAULT_CONFIG.network, ...overrides };
}

export function createServiceConfig(overrides?: Partial<ServiceConfig>): ServiceConfig {
    return { ...DEFAULT_CONFIG.services, ...overrides };
}

export function createCoreConfig(overrides?: Partial<CoreConfig>): CoreConfig {
    return { ...DEFAULT_CONFIG, ...overrides };
}

// Environment-specific configuration getters
export function getDevelopmentConfig(overrides?: Partial<DevelopmentConfig>): DevelopmentConfig {
    return { ...DEVELOPMENT_CONFIG, ...overrides };
}

export function getProductionConfig(overrides?: Partial<ProductionConfig>): ProductionConfig {
    return { ...PRODUCTION_CONFIG, ...overrides };
}

export function getTestConfig(overrides?: Partial<TestConfig>): TestConfig {
    return { ...TEST_CONFIG, ...overrides };
}

// Configuration validation
export function validateCacheConfig(config: CacheConfig): string[] {
    const errors: string[] = [];

    if (config.maxSize && (config.maxSize < 1 || config.maxSize > 10000)) {
        errors.push('Cache maxSize must be between 1 and 10000');
    }

    if (config.defaultTtl && (config.defaultTtl < 1000 || config.defaultTtl > 86400000)) {
        errors.push('Cache defaultTtl must be between 1000ms and 24 hours');
    }

    if (config.strategy && !['lru', 'fifo', 'lfu'].includes(config.strategy)) {
        errors.push('Cache strategy must be one of: lru, fifo, lfu');
    }

    return errors;
}

export function validateWebSocketConfig(config: WebSocketConfig): string[] {
    const errors: string[] = [];

    if (config.reconnectInterval && (config.reconnectInterval < 1000 || config.reconnectInterval > 30000)) {
        errors.push('WebSocket reconnectInterval must be between 1s and 30s');
    }

    if (config.maxReconnectAttempts && (config.maxReconnectAttempts < 1 || config.maxReconnectAttempts > 10)) {
        errors.push('WebSocket maxReconnectAttempts must be between 1 and 10');
    }

    if (config.timeout && (config.timeout < 1000 || config.timeout > 60000)) {
        errors.push('WebSocket timeout must be between 1s and 60s');
    }

    return errors;
}

export function validateAuthConfig(config: AuthConfig): string[] {
    const errors: string[] = [];

    if (config.tokenRefreshInterval && (config.tokenRefreshInterval < 60000 || config.tokenRefreshInterval > 3600000)) {
        errors.push('Auth tokenRefreshInterval must be between 1 minute and 1 hour');
    }

    if (config.sessionTimeout && (config.sessionTimeout < 300000 || config.sessionTimeout > 86400000)) {
        errors.push('Auth sessionTimeout must be between 5 minutes and 24 hours');
    }

    if (config.maxLoginAttempts && (config.maxLoginAttempts < 1 || config.maxLoginAttempts > 10)) {
        errors.push('Auth maxLoginAttempts must be between 1 and 10');
    }

    return errors;
}

export function validateNetworkConfig(config: NetworkConfig): string[] {
    const errors: string[] = [];

    if (config.timeout && (config.timeout < 1000 || config.timeout > 120000)) {
        errors.push('Network timeout must be between 1s and 2 minutes');
    }

    if (config.retryAttempts && (config.retryAttempts < 0 || config.retryAttempts > 5)) {
        errors.push('Network retryAttempts must be between 0 and 5');
    }

    if (config.retryDelay && (config.retryDelay < 100 || config.retryDelay > 10000)) {
        errors.push('Network retryDelay must be between 100ms and 10s');
    }

    return errors;
}

export function validateServiceConfig(config: ServiceConfig): string[] {
    const errors: string[] = [];

    if (config.level && !['debug', 'info', 'warn', 'error'].includes(config.level)) {
        errors.push('Service level must be one of: debug, info, warn, error');
    }

    return errors;
}

export function validateCoreConfig(config: CoreConfig): string[] {
    const errors: string[] = [];

    if (config.cache) {
        errors.push(...validateCacheConfig(config.cache));
    }

    if (config.websocket) {
        errors.push(...validateWebSocketConfig(config.websocket));
    }

    if (config.auth) {
        errors.push(...validateAuthConfig(config.auth));
    }

    if (config.network) {
        errors.push(...validateNetworkConfig(config.network));
    }

    if (config.services) {
        errors.push(...validateServiceConfig(config.services));
    }

    return errors;
}
