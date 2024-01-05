import {getApiResponse} from "./commonRequest";

export const fetchSignup = async (url, body) => {
    try {
        const response = await getApiResponse(url, 'POST', body, null);
        return response;
    } catch (error) { console.log(error) }
}

export const fetchLogin = async (url, body) => {
    try {
        const response = await getApiResponse(url, 'POST', body, null);
        return response;
    } catch (error) { console.log(error) }
}

export const fetchLogout = async (url, token) => {
    try {
        const response = await getApiResponse(url, 'POST', null, token);
        return response;
    } catch (error) { console.log(error) }
}