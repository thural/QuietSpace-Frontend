import {
    ACTIVATE_ACCOUNT,
    LOGIN_URL,
    LOGOUT_URL,
    REFRESH_TOKEN,
    RESEND_CODE,
    SIGNUP_URL
} from "@/shared/constants/apiPath";
import {apiClient} from "@/core/network/rest/apiClient";
import {AuthRequest, AuthResponse, RefreshTokenResponse, RegisterRequest} from "@/features/auth/data/models/auth";
import {AuthResponseSchema, RefreshTokenResponseSchema} from "@/features/auth/data/models/authZod";
import {JwtToken} from "@/shared/api/models/common";


export const fetchSignup = async (body: RegisterRequest): Promise<Response> => (
    await apiClient.post(SIGNUP_URL, body)
);

export const fetchLogin = async (body: AuthRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post(LOGIN_URL, body);
    return AuthResponseSchema.parse(data);
};

export const fetchLogout = async (): Promise<Response> => (
    await apiClient.post(LOGOUT_URL)
);

export const fetchAccessToken = async (token: JwtToken): Promise<RefreshTokenResponse> => {
    const { data } = await apiClient.post(REFRESH_TOKEN, { token });
    return RefreshTokenResponseSchema.parse(data);
};

export const fetchActivation = async (code: string): Promise<Response> => (
    await apiClient.post(ACTIVATE_ACCOUNT + `?token=${code}`)
);

export const fetchResendCode = async (email: string): Promise<Response> => (
    await apiClient.post(RESEND_CODE + `?email=${email}`)
);