/**
 * Session-Based Authentication Provider
 *
 * Implements cookie-based session management with server-side validation
 *
 * Features:
 * - Cookie-based session management
 * - Server-side session validation
 * - Session fixation protection
 * - Automatic session refresh
 * - Cross-tab synchronization
 * - Session timeout handling
 * - Secure cookie management
 */

import { AuthErrorType, AuthProviderType } from '../types/auth.domain.types';
import type { IAuthenticator, HealthCheckResult, PerformanceMetrics } from '../interfaces/IAuthenticator';
import type { AuthCredentials, AuthResult, AuthSession } from '../types/auth.domain.types';

/**
 * Session configuration
 */
export interface SessionConfig {
    sessionTimeout: number;
    refreshInterval: number;
    cookieName: string;
    cookieDomain?: string;
    cookiePath: string;
    secure: boolean;
    httpOnly: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    enableCrossTabSync: boolean;
    enableAutoRefresh: boolean;
    maxRetries: number;
}

/**
 * Session data structure
 */
interface SessionData {
    sessionId: string;
    userId: string;
    email: string;
    roles: string[];
    permissions: string[];
    createdAt: Date;
    expiresAt: Date;
    lastAccessed: Date;
    ipAddress?: string;
    userAgent?: string;
    isActive: boolean;
}

/**
 * Session Provider Implementation
 */
export class SessionAuthProvider implements IAuthenticator {
    readonly name = 'Session Provider';
    readonly type = AuthProviderType.SESSION;
    readonly config: Record<string, unknown> = {
        sessionTimeout: 30 * 60 * 1000, // 30 minutes
        refreshInterval: 5 * 60 * 1000, // 5 minutes
        cookieName: 'auth_session',
        cookiePath: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        enableCrossTabSync: true,
        enableAutoRefresh: true,
        maxRetries: 3
    };

    private currentSession: SessionData | undefined;
    private refreshTimer?: NodeJS.Timeout | undefined;
    private readonly storageKey = 'auth_session_data';
    private syncChannel?: BroadcastChannel | null;
    private initTime?: number;
    private performanceMetrics = {
        totalAttempts: 0,
        successfulAuthentications: 0,
        failedAuthentications: 0,
        averageResponseTime: 0,
        lastAuthentication: undefined as Date | undefined,
        errorsByType: {} as Record<string, number>
    };

    constructor() {
        this.initializeCrossTabSync();
        this.initTime = Date.now();
    }

    /**
     * Authenticates user with session credentials
     */
    async authenticate(credentials: AuthCredentials): Promise<AuthResult<AuthSession>> {
        try {
            // Handle session creation from login credentials
            if (credentials.email && credentials.password) {
                return await this.createSession(credentials);
            }

            // Handle session validation from existing session
            if (credentials.sessionId) {
                return await this.validateSessionById(credentials.sessionId as string);
            }

            // Handle session restoration from cookie
            if (credentials.useCookie) {
                return await this.restoreSessionFromCookie();
            }

            return {
                success: false,
                error: {
                    type: AuthErrorType.VALIDATION_ERROR,
                    message: 'Session authentication requires credentials (email/password), sessionId, or useCookie flag',
                    code: 'SESSION_MISSING_CREDENTIALS'
                }
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: {
                    type: AuthErrorType.SERVER_ERROR,
                    message: `Session authentication failed: ${errorMessage}`,
                    code: 'SESSION_AUTH_ERROR'
                }
            };
        }
    }

    /**
     * Registers user (creates new session)
     */
    async register(userData: AuthCredentials): Promise<AuthResult<void>> {
        try {
            if (!userData.email || !userData.password) {
                return {
                    success: false,
                    error: {
                        type: AuthErrorType.VALIDATION_ERROR,
                        message: 'Registration requires email and password',
                        code: 'SESSION_REGISTER_MISSING_FIELDS'
                    }
                };
            }

            // Simulate user registration (in real implementation, call API)
            const registrationResult = await this.simulateUserRegistration(userData);

            if (!registrationResult.success) {
                return registrationResult;
            }

            // Create session after successful registration
            const sessionResult = await this.createSession(userData);

            if (!sessionResult.success) {
                const result: AuthResult<void> = {
                    success: false
                };

                if (sessionResult.error) {
                    result.error = sessionResult.error;
                }

                return result;
            }

            return {
                success: true,
                data: undefined
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: {
                    type: AuthErrorType.SERVER_ERROR,
                    message: `Session registration failed: ${errorMessage}`,
                    code: 'SESSION_REGISTER_ERROR'
                }
            };
        }
    }

    /**
     * Activates user account (not typically used for session-based auth)
     */
    async activate(code: string): Promise<AuthResult<void>> {
        try {
            // Simulate account activation
            const activationResult = await this.simulateAccountActivation(code);

            if (!activationResult.success) {
                return activationResult;
            }

            return {
                success: true,
                data: undefined
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: {
                    type: AuthErrorType.SERVER_ERROR,
                    message: `Session activation failed: ${errorMessage}`,
                    code: 'SESSION_ACTIVATE_ERROR'
                }
            };
        }
    }

    /**
     * Signs out user and clears session
     */
    async signout(): Promise<AuthResult<void>> {
        try {
            // Clear current session
            if (this.currentSession) {
                await this.clearSession();
            }

            // Clear session cookie
            this.clearSessionCookie();

            // Clear local storage
            localStorage.removeItem(this.storageKey);

            // Stop auto-refresh
            if (this.refreshTimer) {
                clearInterval(this.refreshTimer);
                this.refreshTimer = undefined;
            }

            // Notify other tabs
            this.broadcastSessionChange('signout');

            return {
                success: true,
                data: undefined
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: {
                    type: AuthErrorType.SERVER_ERROR,
                    message: `Session signout failed: ${errorMessage}`,
                    code: 'SESSION_SIGNOUT_ERROR'
                }
            };
        }
    }

    /**
     * Refreshes session (extends expiration)
     */
    async refreshToken(): Promise<AuthResult<AuthSession>> {
        try {
            if (!this.currentSession) {
                return {
                    success: false,
                    error: {
                        type: AuthErrorType.VALIDATION_ERROR,
                        message: 'No active session to refresh',
                        code: 'SESSION_NO_ACTIVE_SESSION'
                    }
                };
            }

            const now = new Date();

            // Check if session is still valid
            if (now >= this.currentSession.expiresAt) {
                return {
                    success: false,
                    error: {
                        type: AuthErrorType.TOKEN_EXPIRED,
                        message: 'Session has expired',
                        code: 'SESSION_EXPIRED'
                    }
                };
            }

            // Extend session expiration
            const newExpiresAt = new Date(now.getTime() + (this.config.sessionTimeout as number));
            this.currentSession.expiresAt = newExpiresAt;
            this.currentSession.lastAccessed = now;

            // Update session storage
            await this.saveSession();

            // Update cookie
            this.setSessionCookie(this.currentSession.sessionId);

            // Notify other tabs
            this.broadcastSessionChange('refresh');

            return {
                success: true,
                data: {
                    user: {
                        id: this.currentSession.userId,
                        email: this.currentSession.email,
                        roles: this.currentSession.roles,
                        permissions: this.currentSession.permissions
                    },
                    token: {
                        accessToken: this.currentSession.sessionId,
                        refreshToken: '',
                        expiresAt: newExpiresAt,
                        tokenType: 'Session',
                        scope: ['session']
                    },
                    provider: this.type,
                    createdAt: this.currentSession.createdAt,
                    expiresAt: newExpiresAt,
                    isActive: true,
                    metadata: {
                        ipAddress: this.currentSession.ipAddress || 'unknown',
                        userAgent: this.currentSession.userAgent || 'unknown',
                        sessionId: this.currentSession.sessionId
                    }
                }
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: {
                    type: AuthErrorType.SERVER_ERROR,
                    message: `Session refresh failed: ${errorMessage}`,
                    code: 'SESSION_REFRESH_ERROR'
                }
            };
        }
    }

    /**
     * Validates current session
     */
    async validateSession(): Promise<AuthResult<boolean>> {
        try {
            if (!this.currentSession) {
                return {
                    success: true,
                    data: false
                };
            }

            const now = new Date();

            // Check if session has expired
            if (now >= this.currentSession.expiresAt) {
                await this.clearSession();
                return {
                    success: true,
                    data: false
                };
            }

            // Update last accessed time
            this.currentSession.lastAccessed = now;
            await this.saveSession();

            return {
                success: true,
                data: true
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: {
                    type: AuthErrorType.SERVER_ERROR,
                    message: `Session validation failed: ${errorMessage}`,
                    code: 'SESSION_VALIDATION_ERROR'
                }
            };
        }
    }

    /**
     * Configures provider
     */
    configure(config: Record<string, unknown>): void {
        Object.assign(this.config, config);

        // Restart auto-refresh with new interval if enabled
        if (this.config.enableAutoRefresh && this.currentSession) {
            this.startAutoRefresh();
        }
    }

    /**
     * Gets provider capabilities
     */
    getCapabilities(): string[] {
        return [
            'session_authentication',
            'cookie_based_sessions',
            'server_side_validation',
            'session_fixation_protection',
            'cross_tab_synchronization',
            'auto_session_refresh',
            'session_timeout_handling',
            'secure_cookie_management'
        ];
    }

    /**
     * Initializes provider
     */
    async initialize(): Promise<void> {
        console.log('Session Provider initialized');

        // Try to restore session from storage
        await this.restoreSessionFromStorage();

        // Start auto-refresh if enabled and session exists
        if (this.config.enableAutoRefresh && this.currentSession) {
            this.startAutoRefresh();
        }
    }

    /**
     * Performs health check on authentication provider
     */
    async healthCheck(): Promise<HealthCheckResult> {
        const startTime = Date.now();
        const isHealthy = this.currentSession?.isActive || false;
        const responseTime = Date.now() - startTime;

        return {
            healthy: isHealthy,
            timestamp: new Date(),
            responseTime,
            message: isHealthy ? 'Session provider is healthy' : 'No active session',
            metadata: {
                hasActiveSession: !!this.currentSession,
                sessionId: this.currentSession?.sessionId,
                lastAccessed: this.currentSession?.lastAccessed
            }
        };
    }

    /**
     * Gets performance metrics for authentication provider
     */
    getPerformanceMetrics(): PerformanceMetrics {
        const successRate = this.performanceMetrics.totalAttempts > 0
            ? (this.performanceMetrics.successfulAuthentications / this.performanceMetrics.totalAttempts) * 100
            : 0;

        return {
            totalAttempts: this.performanceMetrics.totalAttempts,
            successfulAuthentications: this.performanceMetrics.successfulAuthentications,
            failedAuthentications: this.performanceMetrics.failedAuthentications,
            averageResponseTime: this.performanceMetrics.averageResponseTime,
            lastAuthentication: this.performanceMetrics.lastAuthentication || new Date(),
            errorsByType: this.performanceMetrics.errorsByType,
            statistics: {
                successRate,
                failureRate: 100 - successRate,
                throughput: this.performanceMetrics.totalAttempts / (this.getUptime() / 60000) // per minute
            }
        };
    }

    /**
     * Resets performance metrics
     */
    resetPerformanceMetrics(): void {
        this.performanceMetrics = {
            totalAttempts: 0,
            successfulAuthentications: 0,
            failedAuthentications: 0,
            averageResponseTime: 0,
            lastAuthentication: undefined,
            errorsByType: {}
        };
    }

    /**
     * Checks if provider is currently healthy
     */
    async isHealthy(): Promise<boolean> {
        const healthResult = await this.healthCheck();
        return healthResult.healthy;
    }

    /**
     * Gets provider initialization status
     */
    isInitialized(): boolean {
        return !!this.initTime;
    }

    /**
     * Gets provider uptime in milliseconds
     */
    getUptime(): number {
        return this.initTime ? Date.now() - this.initTime : 0;
    }

    /**
     * Gracefully shuts down provider
     */
    async shutdown(): Promise<void> {
        // Clear session
        if (this.currentSession) {
            await this.signout();
        }

        // Clear timers
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = undefined;
        }

        // Close broadcast channel
        if (this.syncChannel) {
            this.syncChannel.close();
            this.syncChannel = null;
        }

        // Reset metrics
        this.resetPerformanceMetrics();
    }

    /**
     * Creates new session from user credentials
     */
    private async createSession(credentials: AuthCredentials): Promise<AuthResult<AuthSession>> {
        try {
            // Simulate authentication (in real implementation, call API)
            const authResult = await this.authenticateUser(credentials);

            if (!authResult.success) {
                return {
                    success: false,
                    error: authResult.error!
                } as AuthResult<AuthSession>;
            }

            const userData = authResult.data as {
                userId: string;
                roles: string[];
                permissions: string[];
            };

            const now = new Date();
            const sessionId = this.generateSessionId();
            const expiresAt = new Date(now.getTime() + (this.config.sessionTimeout as number));

            // Create session data
            this.currentSession = {
                sessionId,
                userId: userData.userId,
                email: credentials.email!,
                roles: userData.roles,
                permissions: userData.permissions,
                createdAt: now,
                expiresAt,
                lastAccessed: now,
                ipAddress: await this.getClientIP(),
                userAgent: navigator.userAgent,
                isActive: true
            };

            // Save session
            await this.saveSession();

            // Set session cookie
            this.setSessionCookie(sessionId);

            // Start auto-refresh
            if (this.config.enableAutoRefresh) {
                this.startAutoRefresh();
            }

            // Notify other tabs
            this.broadcastSessionChange('create');

            // Return AuthSession
            const authSession: AuthSession = {
                user: {
                    id: this.currentSession.userId,
                    email: this.currentSession.email,
                    roles: this.currentSession.roles,
                    permissions: this.currentSession.permissions
                },
                token: {
                    accessToken: this.currentSession.sessionId,
                    refreshToken: '',
                    expiresAt,
                    tokenType: 'Session',
                    scope: ['session']
                },
                provider: this.type,
                createdAt: now,
                expiresAt,
                isActive: true,
                metadata: {
                    ipAddress: this.currentSession.ipAddress || 'unknown',
                    userAgent: this.currentSession.userAgent || 'unknown',
                    sessionId: this.currentSession.sessionId
                }
            };

            return {
                success: true,
                data: authSession
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: {
                    type: AuthErrorType.SERVER_ERROR,
                    message: `Session creation failed: ${errorMessage}`,
                    code: 'SESSION_CREATION_ERROR'
                }
            };
        }
    }

    /**
     * Validates existing session by ID
     */
    private async validateSessionById(sessionId: string): Promise<AuthResult<AuthSession>> {
        try {
            // Simulate server-side validation
            const validationResult = await this.validateSessionWithServer(sessionId);

            if (!validationResult.success) {
                return {
                    success: false,
                    error: validationResult.error!
                };
            }

            const sessionData = validationResult.data!;

            // Update current session
            this.currentSession = {
                ...sessionData,
                lastAccessed: new Date()
            } as SessionData;

            // Save updated session
            await this.saveSession();

            // Start auto-refresh
            if (this.config.enableAutoRefresh) {
                this.startAutoRefresh();
            }

            // Return AuthSession
            const authSession: AuthSession = {
                user: {
                    id: this.currentSession.userId,
                    email: this.currentSession.email,
                    roles: this.currentSession.roles,
                    permissions: this.currentSession.permissions
                },
                token: {
                    accessToken: this.currentSession.sessionId,
                    refreshToken: '',
                    expiresAt: this.currentSession.expiresAt,
                    tokenType: 'Session',
                    scope: ['session']
                },
                provider: this.type,
                createdAt: this.currentSession.createdAt,
                expiresAt: this.currentSession.expiresAt,
                isActive: true,
                metadata: {
                    ipAddress: this.currentSession.ipAddress || 'unknown',
                    userAgent: this.currentSession.userAgent || 'unknown',
                    sessionId: this.currentSession.sessionId
                }
            };

            return {
                success: true,
                data: authSession
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: {
                    type: AuthErrorType.SERVER_ERROR,
                    message: `Session validation failed: ${errorMessage}`,
                    code: 'SESSION_VALIDATION_ERROR'
                }
            };
        }
    }

    /**
     * Restores session from cookie
     */
    private async restoreSessionFromCookie(): Promise<AuthResult<AuthSession>> {
        try {
            const sessionId = this.getSessionCookie();

            if (!sessionId) {
                return {
                    success: false,
                    error: {
                        type: AuthErrorType.VALIDATION_ERROR,
                        message: 'No session cookie found',
                        code: 'SESSION_NO_COOKIE'
                    }
                };
            }

            return await this.validateSessionById(sessionId);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: {
                    type: AuthErrorType.SERVER_ERROR,
                    message: `Session restoration failed: ${errorMessage}`,
                    code: 'SESSION_RESTORATION_ERROR'
                }
            };
        }
    }

    /**
     * Restores session from local storage
     */
    private async restoreSessionFromStorage(): Promise<void> {
        try {
            const storedSession = localStorage.getItem(this.storageKey);

            if (storedSession) {
                const sessionData = JSON.parse(storedSession);

                // Check if session is still valid
                const now = new Date();
                if (now < new Date(sessionData.expiresAt) && sessionData.isActive) {
                    this.currentSession = {
                        ...sessionData,
                        createdAt: new Date(sessionData.createdAt),
                        expiresAt: new Date(sessionData.expiresAt),
                        lastAccessed: new Date(sessionData.lastAccessed)
                    };
                } else {
                    // Clear expired session
                    localStorage.removeItem(this.storageKey);
                }
            }
        } catch (error) {
            console.warn('Failed to restore session from storage:', error);
            localStorage.removeItem(this.storageKey);
        }
    }

    /**
     * Saves session to storage
     */
    private async saveSession(): Promise<void> {
        if (this.currentSession) {
            localStorage.setItem(this.storageKey, JSON.stringify(this.currentSession));
        }
    }

    /**
     * Clears current session
     */
    private async clearSession(): Promise<void> {
        this.currentSession = undefined;
        localStorage.removeItem(this.storageKey);
    }

    /**
     * Sets session cookie
     */
    private setSessionCookie(sessionId: string): void {
        const expires = new Date(Date.now() + (this.config.sessionTimeout as number)).toUTCString();
        let cookieString = `${this.config.cookieName}=${sessionId}; expires=${expires}; path=${this.config.cookiePath}`;

        if (this.config.secure) {
            cookieString += '; secure';
        }

        if (this.config.httpOnly) {
            cookieString += '; httponly';
        }

        if (this.config.sameSite !== 'none') {
            cookieString += '; samesite=' + this.config.sameSite;
        }

        if (this.config.cookieDomain) {
            cookieString += '; domain=' + this.config.cookieDomain;
        }

        document.cookie = cookieString;
    }

    /**
     * Clears session cookie
     */
    private clearSessionCookie(): void {
        const expires = new Date(0).toUTCString();
        document.cookie = `${this.config.cookieName}=; expires=${expires}; path=${this.config.cookiePath}`;
    }

    /**
     * Gets session cookie value
     */
    private getSessionCookie(): string | null {
        const name = this.config.cookieName + '=';
        const cookies = document.cookie.split(';');

        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name)) {
                return cookie.substring(name.length);
            }
        }

        return null;
    }

    /**
     * Starts auto-refresh timer
     */
    private startAutoRefresh(): void {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }

        this.refreshTimer = setInterval(async () => {
            if (this.currentSession) {
                await this.refreshToken();
            }
        }, this.config.refreshInterval as number);
    }

    /**
     * Initializes cross-tab synchronization
     */
    private initializeCrossTabSync(): void {
        if (this.config.enableCrossTabSync && typeof BroadcastChannel !== 'undefined') {
            this.syncChannel = new BroadcastChannel('auth_session_sync');

            this.syncChannel.onmessage = (event) => {
                const { type } = event.data;

                switch (type) {
                    case 'create':
                    case 'refresh':
                        this.restoreSessionFromStorage();
                        break;
                    case 'signout':
                        this.clearSession();
                        break;
                }
            };
        }
    }

    /**
     * Broadcasts session changes to other tabs
     */
    private broadcastSessionChange(type: string): void {
        if (this.syncChannel) {
            this.syncChannel.postMessage({
                type,
                data: this.currentSession
            });
        }
    }

    /**
     * Generates secure session ID
     */
    private generateSessionId(): string {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);

        let result = '';
        for (let i = 0; i < array.length; i++) {
            const value = array[i];
            if (value !== undefined) {
                result += String.fromCharCode(value);
            }
        }
        return btoa(result).replace(/[^a-zA-Z0-9]/g, '');
    }

    /**
     * Simulates user authentication (replace with real API call)
     */
    private async authenticateUser(credentials: AuthCredentials): Promise<AuthResult<{
        userId: string;
        roles: string[];
        permissions: string[];
    }>> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));

        // Mock authentication logic - accept any valid email/password
        if (credentials.email && credentials.password) {
            return {
                success: true,
                data: {
                    userId: 'user-' + Math.random().toString(36).substring(7),
                    roles: ['user'],
                    permissions: ['read:posts', 'create:posts']
                }
            };
        }

        return {
            success: false,
            error: {
                type: AuthErrorType.CREDENTIALS_INVALID,
                message: 'Invalid email or password',
                code: 'SESSION_INVALID_CREDENTIALS'
            }
        };
    }

    /**
     * Simulates user registration (replace with real API call)
     */
    private async simulateUserRegistration(userData: AuthCredentials): Promise<AuthResult<void>> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));

        // Mock registration logic - always succeeds for valid email/password
        if (userData.email && userData.password) {
            return {
                success: true,
                data: undefined
            };
        }

        return {
            success: false,
            error: {
                type: AuthErrorType.VALIDATION_ERROR,
                message: 'Invalid registration data',
                code: 'SESSION_INVALID_REGISTRATION'
            }
        };
    }

    /**
     * Simulates account activation (replace with real API call)
     */
    private async simulateAccountActivation(code: string): Promise<AuthResult<void>> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));

        // Mock activation logic
        if (code === 'valid-activation-code') {
            return {
                success: true,
                data: undefined
            };
        }

        return {
            success: false,
            error: {
                type: AuthErrorType.VALIDATION_ERROR,
                message: 'Invalid activation code',
                code: 'SESSION_INVALID_ACTIVATION'
            }
        };
    }

    /**
     * Simulates server-side session validation (replace with real API call)
     */
    private async validateSessionWithServer(sessionId: string): Promise<AuthResult<SessionData>> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 50));

        // Mock validation logic
        if (sessionId && sessionId.length > 10) {
            const now = new Date();
            return {
                success: true,
                data: {
                    sessionId,
                    userId: 'user-123',
                    email: 'test@example.com',
                    roles: ['user'],
                    permissions: ['read:posts', 'create:posts'],
                    createdAt: new Date(now.getTime() - 10 * 60 * 1000), // 10 minutes ago
                    expiresAt: new Date(now.getTime() + 20 * 60 * 1000), // 20 minutes from now
                    lastAccessed: now,
                    isActive: true
                }
            };
        }

        return {
            success: false,
            error: {
                type: AuthErrorType.TOKEN_INVALID,
                message: 'Invalid session ID',
                code: 'SESSION_INVALID_ID'
            }
        };
    }

    /**
     * Gets client IP address
     */
    private async getClientIP(): Promise<string> {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch {
            return 'unknown';
        }
    }
}
