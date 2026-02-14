import type { AxiosInstance } from 'axios';
import {
    ACTIVATE_ACCOUNT,
    LOGIN_URL,
    LOGOUT_URL,
    REFRESH_TOKEN,
    RESEND_CODE,
    SIGNUP_URL
} from "@/shared/constants/apiPath";
import { AuthRequest, AuthResponse, RefreshTokenResponse, RegisterRequest } from "@auth/data/models/auth";
import { LocalAuthRepository } from "@/core/modules/authentication/repositories/LocalAuthRepository";
import { IAuthRepository, UserSession, LoginAttempt, SecurityEvent, UserProfile, UserDevice, DeviceInfo, TwoFactorStatus, TwoFactorSetup, RateLimitResult, AuditEntry, ActivityEntry } from "@features/auth/domain/entities/IAuthRepository";

/**
 * Auth Repository - Handles authentication-related API operations
 * Implements enterprise-grade data access patterns with comprehensive security features
 */
export class AuthRepository implements IAuthRepository {
    private readonly localAuthRepository = new LocalAuthRepository();

    constructor(private apiClient: AxiosInstance) { }

    // Core authentication operations
    async signup(body: RegisterRequest): Promise<Response> {
        return await this.apiClient.post(SIGNUP_URL, body);
    }

    async login(body: AuthRequest): Promise<AuthResponse> {
        const { data } = await this.apiClient.post(LOGIN_URL, body);
        return {
            success: true,
            data: data as any
        };
    }

    async logout(): Promise<Response> {
        return await this.apiClient.post(LOGOUT_URL);
    }

    async refreshToken(): Promise<RefreshTokenResponse> {
        const token = await this.localAuthRepository.getRefreshToken();
        const { data } = await this.apiClient.post(REFRESH_TOKEN, { token });
        return {
            success: true,
            data: data as any
        };
    }

    // User registration and activation
    async activateAccount(code: string): Promise<Response> {
        return await this.apiClient.post(ACTIVATE_ACCOUNT + `?token=${code}`);
    }

    async resendCode(email: string): Promise<Response> {
        return await this.apiClient.post(RESEND_CODE + `?email=${email}`);
    }

    // User session management
    async getUserSessions(userId: string): Promise<UserSession[]> {
        const { data } = await this.apiClient.get(`/auth/sessions/${userId}`);
        return data;
    }

    async revokeSession(sessionId: string): Promise<void> {
        await this.apiClient.delete(`/auth/sessions/${sessionId}`);
    }

    async revokeAllSessions(userId: string): Promise<void> {
        await this.apiClient.delete(`/auth/sessions/user/${userId}`);
    }

    // Security operations
    async getLoginAttempts(email: string): Promise<LoginAttempt[]> {
        const { data } = await this.apiClient.get(`/auth/login-attempts/${email}`);
        return data;
    }

    async recordLoginAttempt(email: string, success: boolean, ip?: string): Promise<void> {
        await this.apiClient.post('/auth/login-attempts', {
            email,
            success,
            ipAddress: ip
        });
    }

    async getSecurityEvents(userId: string): Promise<SecurityEvent[]> {
        const { data } = await this.apiClient.get(`/auth/security-events/${userId}`);
        return data;
    }

    // User profile and preferences
    async getUserProfile(userId: string): Promise<UserProfile> {
        const { data } = await this.apiClient.get(`/auth/profile/${userId}`);
        return data;
    }

    async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
        const { data } = await this.apiClient.patch(`/auth/profile/${userId}`, updates);
        return data;
    }

    async getUserPermissions(userId: string): Promise<string[]> {
        const { data } = await this.apiClient.get(`/auth/permissions/${userId}`);
        return data;
    }

    async getUserRoles(userId: string): Promise<string[]> {
        const { data } = await this.apiClient.get(`/auth/roles/${userId}`);
        return data;
    }

    // Device management
    async getUserDevices(userId: string): Promise<UserDevice[]> {
        const { data } = await this.apiClient.get(`/auth/devices/${userId}`);
        return data;
    }

    async registerDevice(userId: string, device: DeviceInfo): Promise<UserDevice> {
        const { data } = await this.apiClient.post(`/auth/devices/${userId}`, device);
        return data;
    }

    async revokeDevice(deviceId: string): Promise<void> {
        await this.apiClient.delete(`/auth/devices/${deviceId}`);
    }

    // Two-factor authentication
    async getTwoFactorStatus(userId: string): Promise<TwoFactorStatus> {
        const { data } = await this.apiClient.get(`/auth/2fa/${userId}`);
        return data;
    }

    async enableTwoFactor(userId: string): Promise<TwoFactorSetup> {
        const { data } = await this.apiClient.post(`/auth/2fa/${userId}/enable`);
        return data;
    }

    async verifyTwoFactor(userId: string, code: string): Promise<boolean> {
        const { data } = await this.apiClient.post(`/auth/2fa/${userId}/verify`, { code });
        return data.valid;
    }

    async disableTwoFactor(userId: string, code: string): Promise<void> {
        await this.apiClient.post(`/auth/2fa/${userId}/disable`, { code });
    }

    // Rate limiting
    async checkRateLimit(identifier: string, action: string): Promise<RateLimitResult> {
        const { data } = await this.apiClient.get(`/auth/rate-limit/${identifier}/${action}`);
        return data;
    }

    async recordRateLimitHit(identifier: string, action: string): Promise<void> {
        await this.apiClient.post(`/auth/rate-limit/${identifier}/${action}/hit`);
    }

    // Audit and logging
    async getAuditLog(userId: string, limit: number = 100): Promise<AuditEntry[]> {
        const { data } = await this.apiClient.get(`/auth/audit/${userId}?limit=${limit}`);
        return data;
    }

    async recordActivity(userId: string, activity: ActivityEntry): Promise<void> {
        await this.apiClient.post(`/auth/activity/${userId}`, activity);
    }
}
