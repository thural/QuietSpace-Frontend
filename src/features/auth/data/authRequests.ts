import {
    ACTIVATE_ACCOUNT,
    LOGIN_URL,
    LOGOUT_URL,
    RESEND_CODE,
    REFRESH_TOKEN,
    SIGNUP_URL
} from "@/core/shared/apiPath";
import { createApiClient, type IApiClient } from "@/core/network";
import { AuthRequest, AuthResponse, RefreshTokenResponse, RegisterRequest } from "@/features/auth/data/models/auth";
import { AuthResponseSchema, RefreshTokenResponseSchema } from "@/features/auth/data/models/authZod";
import { JwtToken } from "@/shared/api/models/common";

// Create authenticated API client
const apiClient: IApiClient = createApiClient();

export const fetchSignup = async (body: RegisterRequest): Promise<void> => {
    await apiClient.post(SIGNUP_URL, body);
};

export const fetchLogin = async (body: AuthRequest): Promise<AuthResponse> => {
    const response = await apiClient.post(LOGIN_URL, body);
    return AuthResponseSchema.parse(response.data);
};

export const fetchLogout = async (): Promise<void> => {
    await apiClient.post(LOGOUT_URL);
};

export const fetchAccessToken = async (token: JwtToken): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post(REFRESH_TOKEN, { token });
    return RefreshTokenResponseSchema.parse(response.data);
};

export const fetchActivation = async (code: string): Promise<void> => {
    await apiClient.post(ACTIVATE_ACCOUNT + `?token=${code}`);
};

export const fetchResendCode = async (email: string): Promise<void> => {
    await apiClient.post(RESEND_CODE + `?email=${email}`);
};