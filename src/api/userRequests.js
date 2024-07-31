import {getApiResponse} from "./commonRequest";

export const fetchUser = async (url, token) => {
    try {
        return await getApiResponse(url, 'GET', null, token);
    } catch (error) { throw Error(error.message) }
}

export const fetchUserById = async (url, token) => {
    try {
        return await getApiResponse(url, 'GET', null, token);
    } catch (error) { throw Error(error.message) }
}

export const fetchUsersByQuery = async (url, queryText, token) => {
    try {
        return await getApiResponse(url + `/search?query=${queryText}`, 'GET', null, token);
    } catch (error) { throw Error(error.message) }
}