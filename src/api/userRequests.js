import {getApiResponse} from "./commonRequest";

export const fetchUser = async (url, token) => {
    try {
        return await getApiResponse(url, 'GET', null, token);
    } catch (err) {
        console.log(err)
    }
}

export const fetchUserById = async (url, token) => {
    try {
        return await getApiResponse(url, 'GET', null, token);
    } catch (err) {
        console.log(err)
    }
}

export const fetchUsersByQuery = async (url, queryText, token) => {
    try {
        return await getApiResponse(url + `/search?query=${queryText}`, 'GET', null, token);
    } catch (err) {
        console.log(err)
    }
}