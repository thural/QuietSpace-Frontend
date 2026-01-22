import {
    ACTIVATE_ACCOUNT,
    LOGIN_URL,
    LOGOUT_URL,
    REFRESH_TOKEN,
    RESEND_CODE,
    SIGNUP_URL
} from "@/shared/constants/apiPath";
import {getWrappedApiResponse} from "@/core/network/rest/fetchApiClient";
import {AuthRequest, AuthResponse, RefreshTokenResponse, RegisterRequest} from "@/features/auth/data/models/auth";
import {AuthResponseSchema, RefreshTokenResponseSchema} from "@/features/auth/data/models/authZod";
import {JwtToken} from "@/shared/api/models/common";


export const fetchSignup = async (body: RegisterRequest): Promise<Response> => (
    await getWrappedApiResponse(SIGNUP_URL, 'POST', body, null)
);

export const fetchLogin = async (body: AuthRequest): Promise<AuthResponse> => {
    const response = await getWrappedApiResponse(LOGIN_URL, 'POST', body, null);
    const data = await response.json();
    return AuthResponseSchema.parse(data);
};

export const fetchLogout = async (token: JwtToken): Promise<Response> => (
    await getWrappedApiResponse(LOGOUT_URL, 'POST', null, token)
);

export const fetchAccessToken = async (token: JwtToken): Promise<RefreshTokenResponse> => {
    const response = await getWrappedApiResponse(REFRESH_TOKEN, 'POST', null, token);
    const data = await response.json();
    return RefreshTokenResponseSchema.parse(data);
};

export const fetchActivation = async (code: string): Promise<Response> => (
    await getWrappedApiResponse(ACTIVATE_ACCOUNT + `?token=${code}`, 'POST', null, null)
);

export const fetchResendCode = async (email: string): Promise<Response> => (
    await getWrappedApiResponse(RESEND_CODE + `?email=${email}`, 'POST', null, null)
);