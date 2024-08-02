import { ACTIVATE_ACCOUNT, LOGIN_URL, LOGOUT_URL, REFRESH_TOKEN, RESEND_CODE, SIGNUP_URL } from "../constants/ApiPath";
import { getApiResponse } from "./commonRequest";

export const fetchSignup = async (body) => {
    try {
        return await getApiResponse(SIGNUP_URL, 'POST', body, null);
    } catch (error) { throw Error(error.message) }
}

export const fetchLogin = async (body) => {
    try {
        return await getApiResponse(LOGIN_URL, 'POST', body, null);
    } catch (error) { throw Error(error.message) }
}

export const fetchLogout = async (token) => {
    try {
        return await getApiResponse(LOGOUT_URL, 'POST', null, token);
    } catch (error) { throw Error(error.message) }
}

export const fetchAccessToken = async (token) => {
    try {
        return await getApiResponse(REFRESH_TOKEN, 'POST', null, token);
    } catch (error) { throw Error(error.message) }
}

export const fetchActivation = async (code) => {
    try {
        return await getApiResponse(ACTIVATE_ACCOUNT + `?token=${code}`, 'POST', null, null);
    } catch (error) { throw Error(error.message) }
}

export const fetchResendCode = async (email) => {
    try {
        return await getApiResponse(RESEND_CODE + `?email=${email}`, 'POST', null, null);
    } catch (error) { throw Error(error.message) }
}