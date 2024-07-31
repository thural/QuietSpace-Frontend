import {getApiResponse} from "./commonRequest";

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

export const fetchLogout = async (url, token) => {
    try {
        return await getApiResponse(url, 'POST', null, token);
    } catch (error) { throw Error(error.message) }
}