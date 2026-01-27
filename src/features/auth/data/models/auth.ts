/**
 * Auth Feature Types - Phase 1 Migration
 * 
 * TEMPORARY: Defining types inline during migration to establish the pattern.
 * These will be replaced with core auth imports once path resolution is fixed.
 */

// Core authentication types (matching core auth structure)
export interface AuthCredentials {
    email?: string;
    password?: string;
    username?: string;
    token?: string;
    apiKey?: string;
    [key: string]: any;
}

export interface AuthResult<T = any> {
    success: boolean;
    data?: T;
    error?: {
        type: string;
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

export interface AuthSession {
    user: AuthUser;
    token: AuthToken;
    provider: string;
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
        [key: string]: any;
    };
}

export interface AuthEvent {
    type: string;
    timestamp: Date;
    userId?: string;
    providerType?: string;
    details?: Record<string, any>;
    error?: string;
    metadata?: {
        ipAddress?: string;
        userAgent?: string;
        sessionId?: string;
        requestId?: string;
    };
}

// Enums
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

export enum AuthProviderType {
    JWT = 'jwt',
    OAUTH = 'oauth',
    SAML = 'saml',
    LDAP = 'ldap',
    API_KEY = 'api_key',
    SESSION = 'session'
}

export enum AuthStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    SUCCESS = 'success',
    FAILED = 'failed',
    CANCELLED = 'cancelled'
}

// Type aliases for backward compatibility during migration
export type AuthRequest = AuthCredentials;
export type AuthResponse = AuthResult<AuthSession>;
export type RegisterRequest = AuthCredentials;