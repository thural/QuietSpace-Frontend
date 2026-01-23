import { AuthRepository } from '@auth/data/repositories/AuthRepository';
import { AuthRequest, AuthResponse, RefreshTokenResponse, RegisterRequest } from '@auth/data/models/auth';
import { Inject, Injectable } from '@/core/di';
import { TYPES } from '@/core/di/types';

/**
 * Enhanced Auth Service - Provides high-level authentication operations
 * Wraps repository calls with business logic and error handling
 */
@Injectable()
export class AuthService {
    constructor(@Inject(TYPES.AUTH_REPOSITORY) private authRepository: AuthRepository) {}

    async signup(body: RegisterRequest): Promise<Response> {
        return await this.authRepository.signup(body);
    }

    async login(body: AuthRequest): Promise<AuthResponse> {
        return await this.authRepository.login(body);
    }

    async logout(): Promise<Response> {
        return await this.authRepository.logout();
    }

    async refreshToken(): Promise<RefreshTokenResponse> {
        return await this.authRepository.refreshToken();
    }

    async activateAccount(code: string): Promise<Response> {
        return await this.authRepository.activateAccount(code);
    }

    async resendCode(email: string): Promise<Response> {
        return await this.authRepository.resendCode(email);
    }

    // Business logic methods
    async validateAuthData(data: AuthRequest): Promise<boolean> {
        return !!(data.email && data.password && data.email.length > 0 && data.password.length > 0);
    }

    async isTokenExpired(token: string): Promise<boolean> {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const now = Date.now() / 1000;
            return payload.exp < now;
        } catch {
            return true;
        }
    }
}
