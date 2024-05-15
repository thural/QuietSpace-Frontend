import {getApiResponse} from "./commonRequest";

export const fetchSignup = async (url, body) => {
    return await getApiResponse(url, 'POST', body, null);
}

export const fetchLogin = async (url, body) => {
    return await getApiResponse(url, 'POST', body, null);
}

export const fetchLogout = async (url, token) => {
    return await getApiResponse(url, 'POST', null, token);
}