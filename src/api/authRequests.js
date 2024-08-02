import { LOGOUT_URL, REFRESH_TOKEN } from "../constants/ApiPath";
import { getApiResponse } from "./commonRequest";

export const fetchSignup = async (url, body) => {
    try {
        return await getApiResponse(url, 'POST', body, null);
    } catch (error) { throw Error(error.message) }
}

export const fetchLogin = async (url, body) => {
    try {
        return await getApiResponse(url, 'POST', body, null);
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