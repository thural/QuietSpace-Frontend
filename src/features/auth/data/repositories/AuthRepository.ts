import type {AxiosInstance} from 'axios';
import {Inject, Injectable} from '@/core/di';
import {TYPES} from '@/core/di/types';
import {
    ACTIVATE_ACCOUNT,
    LOGIN_URL,
    LOGOUT_URL,
    REFRESH_TOKEN,
    RESEND_CODE,
    SIGNUP_URL
} from "@/shared/constants/apiPath";
import {AuthRequest, AuthResponse, RefreshTokenResponse, RegisterRequest} from "@auth/data/models/auth";
import {AuthResponseSchema, RefreshTokenResponseSchema} from "@features/auth/data/models/authZod";
import {getRefreshToken} from "@/shared/utils/authStoreUtils";

/**
 * Auth Repository - Handles authentication-related API operations
 */
@Injectable()
export class AuthRepository {
    constructor(@Inject(TYPES.API_CLIENT) private apiClient: AxiosInstance) {}

    async signup(body: RegisterRequest): Promise<Response> {
        return await this.apiClient.post(SIGNUP_URL, body);
    }

    async login(body: AuthRequest): Promise<AuthResponse> {
        const { data } = await this.apiClient.post(LOGIN_URL, body);
        return AuthResponseSchema.parse(data);
    }

    async logout(): Promise<Response> {
        return await this.apiClient.post(LOGOUT_URL);
    }

    async refreshToken(): Promise<RefreshTokenResponse> {
        const token = getRefreshToken();
        const { data } = await this.apiClient.post(REFRESH_TOKEN, { token });
        return RefreshTokenResponseSchema.parse(data);
    }

    async activateAccount(code: string): Promise<Response> {
        return await this.apiClient.post(ACTIVATE_ACCOUNT + `?token=${code}`);
    }

    async resendCode(email: string): Promise<Response> {
        return await this.apiClient.post(RESEND_CODE + `?email=${email}`);
    }
}
