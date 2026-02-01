/**
 * Enterprise authentication types and interfaces
 *
 * Provides comprehensive type definitions for authentication
 * with proper separation of concerns and enterprise features.
 */

export enum AuthProviderType {
    JWT = 'jwt',
    OAUTH = 'oauth',
    SAML = 'saml',
    LDAP = 'ldap',
    API_KEY = 'api_key',
    SESSION = 'session'
}

export enum AuthEventType {
    LOGIN_ATTEMPT = 'login_attempt',
    LOGIN_SUCCESS = 'login_success',
    LOGIN_FAILURE = 'login_failure',
    REGISTER_ATTEMPT = 'register_attempt',
    REGISTER_SUCCESS = 'register_success',
    REGISTER_FAILURE = 'register_failure',
    ACTIVATE_ATTEMPT = 'activate_attempt',
    ACTIVATE_SUCCESS = 'activate_success',
    ACTIVATE_FAILURE = 'activate_failure',
    LOGOUT_ATTEMPT = 'logout_attempt',
    LOGOUT_SUCCESS = 'logout_success',
    LOGOUT_FAILURE = 'logout_failure',
    TOKEN_REFRESH = 'token_refresh',
    TOKEN_REFRESH_SUCCESS = 'token_refresh_success',
    TOKEN_REFRESH_FAILURE = 'token_refresh_failure'
}

export enum AuthErrorType {
    VALIDATION_ERROR = 'validation_error',
    NETWORK_ERROR = 'network_error',
    SERVER_ERROR = 'server_error',
    TOKEN_EXPIRED = 'token_expired',
    TOKEN_INVALID = 'token_invalid',
    CREDENTIALS_INVALID = 'credentials_invalid',
    ACCOUNT_LOCKED = 'account_locked',
    RATE_LIMITED = 'rate_limited',
    UNKNOWN_ERROR = 'unknown_error'
}

export enum AuthStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    SUCCESS = 'success',
    FAILED = 'failed',
    CANCELLED = 'cancelled'
}

export interface AuthEvent {
    type: AuthEventType;
    timestamp: Date;
    userId?: string;
    providerType?: AuthProviderType;
    details?: Record<string, any>;
    error?: AuthErrorType;
    metadata?: {
        ipAddress?: string;
        userAgent?: string;
        sessionId?: string;
        requestId?: string;
    };
}

export interface AuthResult<T = any> {
    success: boolean;
    data?: T;
    error?: {
        type: AuthErrorType;
        message: string;
        code?: string;
        details?: Record<string, any>;
    };
    metadata?: {
        timestamp: Date;
        duration: number;
        requestId: string;
    };
}

export interface AuthCredentials {
    email?: string;
    password?: string;
    username?: string;
    token?: string;
    apiKey?: string;
    [key: string]: any;
}

export interface AuthToken {
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    tokenType: string;
    scope?: string[];
    metadata?: {
        issuer: string;
        audience: string;
        issuedAt: Date;
    };
}

export interface AuthUser {
    id: string;
    email: string;
    username?: string;
    roles: string[];
    permissions: string[];
    profile?: {
        firstName?: string;
        lastName?: string;
        avatar?: string;
        bio?: string;
    };
    security?: {
        lastLogin?: Date;
        loginAttempts: number;
        lockedUntil?: Date;
        mfaEnabled?: boolean;
    };
}

export interface AuthSession {
    user: AuthUser;
    token: AuthToken;
    provider: AuthProviderType;
    createdAt: Date;
    expiresAt: Date;
    isActive: boolean;
    metadata?: {
        ipAddress: string;
        userAgent: string;
        deviceId?: string;
        location?: {
            country?: string;
            city?: string;
        };
        [key: string]: any; // Allow additional properties for provider-specific metadata
    };
}

export interface AuthConfig {
    provider: AuthProviderType;
    tokenRefreshInterval: number;
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
    mfaRequired: boolean;
    encryptionEnabled: boolean;
    auditEnabled: boolean;
    rateLimiting: {
        enabled: boolean;
        maxAttempts: number;
        windowMs: number;
    };
}

export interface AuthValidator {
    validate(credentials: AuthCredentials): AuthResult<boolean>;
    validateToken(token: string): AuthResult<boolean>;
    validateUser(user: AuthUser): AuthResult<boolean>;
}

export interface AuthRepository {
    authenticate(credentials: AuthCredentials): Promise<AuthResult<AuthSession>>;
    register(userData: AuthCredentials): Promise<AuthResult<void>>;
    activate(code: string): Promise<AuthResult<void>>;
    signout(refreshToken: string): Promise<AuthResult<void>>;
    refreshToken(refreshToken: string): Promise<AuthResult<AuthToken>>;
    validateSession(session: AuthSession): AuthResult<boolean>;
}

export interface AuthLogger {
    log(event: AuthEvent): void;
    logError(error: Error, context?: Record<string, any>): void;
    logSecurity(event: AuthEvent): void;
    getEvents(filters?: Partial<AuthEvent>): AuthEvent[];
    clear(): void;
}

export interface AuthMetrics {
    recordAttempt(type: AuthEventType, duration: number): void;
    recordSuccess(type: AuthEventType, duration: number): void;
    recordFailure(type: AuthEventType, error: AuthErrorType, duration: number): void;
    getMetrics(timeRange?: { start: Date; end: Date }): {
        attempts: number;
        successRate: number;
        failureRate: number;
        averageDuration: number;
        errorsByType: Record<AuthErrorType, number>;
    };
}

export interface AuthSecurityService {
    detectSuspiciousActivity(events: AuthEvent[]): AuthEvent[];
    validateSecurityHeaders(headers: Record<string, string>): boolean;
    checkRateLimit(userId: string, attempts: number): boolean;
    encryptSensitiveData(data: any): string;
    decryptSensitiveData(encryptedData: string): any;
}
