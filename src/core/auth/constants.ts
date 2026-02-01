/**
 * Authentication System Constants
 * 
 * Constants and enums for the authentication system.
 */

import { AuthProviderType, AuthEventType, AuthErrorType, AuthStatus } from './types/auth.domain.types';

// Re-export enums for convenience
export { AuthProviderType, AuthEventType, AuthErrorType, AuthStatus };

// Default authentication configuration
export const DEFAULT_AUTH_CONFIG = {
    provider: AuthProviderType.JWT,
    tokenRefreshInterval: 300000, // 5 minutes
    sessionTimeout: 3600000, // 1 hour
    maxLoginAttempts: 5,
    lockoutDuration: 900000, // 15 minutes
    enableTwoFactorAuth: false,
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: true,
    enableSessionManagement: true,
    enableRateLimiting: true,
    rateLimitWindow: 900000, // 15 minutes
    rateLimitMaxAttempts: 10,
    enableAuditLogging: true,
    enableSecurityMonitoring: true,
    suspiciousActivityThreshold: 5,
    enableTokenRefresh: true,
    tokenRefreshBuffer: 60000, // 1 minute before expiry
    enableLogoutOnTokenExpiry: true,
    enableConcurrentSessionLimit: false,
    maxConcurrentSessions: 3,
    enableRememberMe: true,
    rememberMeDuration: 2592000000, // 30 days
    enablePasswordReset: true,
    passwordResetTokenExpiry: 3600000, // 1 hour
    enableAccountVerification: true,
    verificationTokenExpiry: 86400000, // 24 hours
    enableSocialLogin: true,
    socialProviders: ['google', 'github', 'microsoft'],
    enableGuestAccess: false,
    guestSessionDuration: 1800000, // 30 minutes
    enableApiKeys: false,
    apiKeyExpiry: 2592000000, // 30 days
    enableWebAuthn: false,
    enableBiometricAuth: false,
    enableSso: false,
    ssoProviders: [],
    enableLdap: false,
    ldapConfig: null,
    enableCustomAuth: false,
    customAuthEndpoints: [],
    securityHeaders: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    },
    corsConfig: {
        origin: ['http://localhost:3000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
};

// Authentication constants
export const AUTH_CONSTANTS = {
    // Token constants
    TOKEN_PREFIX: 'Bearer ',
    TOKEN_HEADER: 'Authorization',
    REFRESH_TOKEN_HEADER: 'X-Refresh-Token',

    // Session constants
    SESSION_COOKIE_NAME: 'auth_session',
    SESSION_STORAGE_KEY: 'auth_session',
    REMEMBER_ME_COOKIE_NAME: 'auth_remember',

    // Local storage keys
    ACCESS_TOKEN_KEY: 'auth_access_token',
    REFRESH_TOKEN_KEY: 'auth_refresh_token',
    USER_KEY: 'auth_user',
    SESSION_KEY: 'auth_session',

    // Event constants
    LOGIN_EVENT: 'auth:login',
    LOGOUT_EVENT: 'auth:logout',
    TOKEN_REFRESH_EVENT: 'auth:token_refresh',
    SESSION_EXPIRED_EVENT: 'auth:session_expired',

    // Error messages
    ERROR_MESSAGES: {
        INVALID_CREDENTIALS: 'Invalid email or password',
        TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
        TOKEN_INVALID: 'Invalid authentication token',
        ACCOUNT_LOCKED: 'Your account has been locked. Please try again later.',
        RATE_LIMITED: 'Too many login attempts. Please try again later.',
        NETWORK_ERROR: 'Network error. Please check your connection.',
        SERVER_ERROR: 'Server error. Please try again later.',
        UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
        VERIFICATION_REQUIRED: 'Please verify your email address.',
        PASSWORD_TOO_WEAK: 'Password does not meet security requirements.',
        EMAIL_ALREADY_EXISTS: 'An account with this email already exists.',
        INVALID_TOKEN: 'Invalid or expired verification token.',
        SESSION_EXPIRED: 'Your session has expired. Please log in again.',
        INSUFFICIENT_PERMISSIONS: 'You do not have permission to perform this action.',
        ACCOUNT_NOT_FOUND: 'Account not found.',
        ACCOUNT_DISABLED: 'Your account has been disabled.',
        TWO_FACTOR_REQUIRED: 'Two-factor authentication is required.',
        TWO_FACTOR_INVALID: 'Invalid two-factor authentication code.',
        SOCIAL_LOGIN_ERROR: 'Error occurred during social login.',
        SSO_ERROR: 'Error occurred during SSO authentication.',
        LDAP_ERROR: 'Error occurred during LDAP authentication.',
        BIOMETRIC_ERROR: 'Error occurred during biometric authentication.',
        API_KEY_INVALID: 'Invalid API key.',
        API_KEY_EXPIRED: 'API key has expired.',
        GUEST_ACCESS_DISABLED: 'Guest access is not enabled.',
        CONCURRENT_SESSION_LIMIT: 'Maximum concurrent sessions reached.',
        PASSWORD_RESET_REQUIRED: 'Password reset is required.',
        ACCOUNT_VERIFICATION_REQUIRED: 'Account verification is required.'
    },

    // Success messages
    SUCCESS_MESSAGES: {
        LOGIN_SUCCESS: 'Login successful.',
        LOGOUT_SUCCESS: 'Logout successful.',
        REGISTER_SUCCESS: 'Registration successful. Please check your email for verification.',
        PASSWORD_RESET_SUCCESS: 'Password reset instructions sent to your email.',
        PASSWORD_UPDATE_SUCCESS: 'Password updated successfully.',
        ACCOUNT_VERIFIED: 'Account verified successfully.',
        TOKEN_REFRESH_SUCCESS: 'Token refreshed successfully.',
        TWO_FACTOR_ENABLED: 'Two-factor authentication enabled successfully.',
        SOCIAL_LOGIN_SUCCESS: 'Social login successful.',
        SSO_LOGIN_SUCCESS: 'SSO login successful.',
        LDAP_LOGIN_SUCCESS: 'LDAP login successful.',
        BIOMETRIC_LOGIN_SUCCESS: 'Biometric authentication successful.',
        API_KEY_CREATED: 'API key created successfully.',
        API_KEY_REVOKED: 'API key revoked successfully.',
        SESSION_EXTENDED: 'Session extended successfully.'
    },

    // Validation patterns
    VALIDATION_PATTERNS: {
        EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
        PHONE: /^\+?[\d\s-()]{10,}$/,
        ZIP_CODE: /^\d{5}(-\d{4})?$/,
        CREDIT_CARD: /^\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}$/,
        SSN: /^\d{3}-\d{2}-\d{4}$/
    },

    // Time constants (in milliseconds)
    TIME_CONSTANTS: {
        SECOND: 1000,
        MINUTE: 60000,
        HOUR: 3600000,
        DAY: 86400000,
        WEEK: 604800000,
        MONTH: 2592000000,
        YEAR: 31536000000
    },

    // Security constants
    SECURITY_CONSTANTS: {
        MAX_LOGIN_ATTEMPTS: 5,
        LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
        TOKEN_REFRESH_BUFFER: 60 * 1000, // 1 minute
        SESSION_TIMEOUT: 60 * 60 * 1000, // 1 hour
        REMEMBER_ME_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 days
        PASSWORD_RESET_TOKEN_EXPIRY: 60 * 60 * 1000, // 1 hour
        VERIFICATION_TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
        API_KEY_EXPIRY: 30 * 24 * 60 * 60 * 1000, // 30 days
        GUEST_SESSION_DURATION: 30 * 60 * 1000, // 30 minutes
        RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
        RATE_LIMIT_MAX_ATTEMPTS: 10,
        SUSPICIOUS_ACTIVITY_THRESHOLD: 5
    }
};

// Authentication log levels
export enum AuthLogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
    FATAL = 'fatal'
}
