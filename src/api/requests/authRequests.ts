import { ACTIVATE_ACCOUNT, LOGIN_URL, LOGOUT_URL, REFRESH_TOKEN, RESEND_CODE, SIGNUP_URL } from "../../constants/apiPath";
import { getWrappedApiResponse } from "./fetchApiUtils";
import { AuthRequest, AuthResponse, RefreshTokenResponse, RegisterRequest } from "../schemas/inferred/auth";
import { JwtToken } from "../schemas/inferred/common";


export const fetchSignup = async (body: RegisterRequest): Promise<Response> => (
    await getWrappedApiResponse(SIGNUP_URL, 'POST', body, null)
);

export const fetchLogin = async (body: AuthRequest): Promise<AuthResponse> => (
    await getWrappedApiResponse(LOGIN_URL, 'POST', body, null)
).json();

export const fetchLogout = async (token: JwtToken): Promise<Response> => (
    await getWrappedApiResponse(LOGOUT_URL, 'POST', null, token)
);

export const fetchAccessToken = async (token: JwtToken): Promise<RefreshTokenResponse> => (
    await getWrappedApiResponse(REFRESH_TOKEN, 'POST', null, token)
).json();

export const fetchActivation = async (code: string): Promise<Response> => (
    await getWrappedApiResponse(ACTIVATE_ACCOUNT + `?token=${code}`, 'POST', null, null)
);

export const fetchResendCode = async (email: string): Promise<Response> => (
    await getWrappedApiResponse(RESEND_CODE + `?email=${email}`, 'POST', null, null)
);