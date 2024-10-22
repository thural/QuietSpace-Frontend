import { ACTIVATE_ACCOUNT, LOGIN_URL, LOGOUT_URL, REFRESH_TOKEN, RESEND_CODE, SIGNUP_URL } from "../constants/ApiPath";
import { genericFetchErrorHandler, getApiResponse } from "./commonRequest";
import { AuthReuest, AuthSchema, RefreshTokenSchema, RegisterRequest } from "./schemas/auth";
import { JwtToken } from "./schemas/common";

export const fetchSignup = async (body: RegisterRequest): Promise<Response> => (
    await genericFetchErrorHandler(() => getApiResponse(SIGNUP_URL, 'POST', body, null))
);

export const fetchLogin = async (body: AuthReuest): Promise<AuthSchema> => (
    await genericFetchErrorHandler(() => getApiResponse(LOGIN_URL, 'POST', body, null))
).json();

export const fetchLogout = async (token: JwtToken): Promise<Response> => (
    await genericFetchErrorHandler(() => getApiResponse(LOGOUT_URL, 'POST', null, token))
);

export const fetchAccessToken = async (token: JwtToken): Promise<RefreshTokenSchema> => (
    await genericFetchErrorHandler(() => getApiResponse(REFRESH_TOKEN, 'POST', null, token))
).json();

export const fetchActivation = async (code: number): Promise<Response> => (
    await genericFetchErrorHandler(() => getApiResponse(ACTIVATE_ACCOUNT + `?token=${code}`, 'POST', null, null))
);

export const fetchResendCode = async (email: string): Promise<Response> => (
    await genericFetchErrorHandler(() => getApiResponse(RESEND_CODE + `?email=${email}`, 'POST', null, null))
);