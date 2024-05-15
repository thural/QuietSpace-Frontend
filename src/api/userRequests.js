import {getApiResponse} from "./commonRequest";

export const fetchUser = async (url, token) => {
    return await getApiResponse(url, 'GET', null, token);
}

export const fetchUserById = async (url, token) => {
    return await getApiResponse(url, 'GET', null, token);
}

export const fetchUsersByQuery = async (url, queryText, token) => {
    return await getApiResponse(url + `/search?query=${queryText}`, 'GET', null, token);
}