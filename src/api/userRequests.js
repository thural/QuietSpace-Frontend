import {getApiResponse} from "./commonRequest";
import {USER_PATH} from "../constants/ApiPath";

export const fetchUser = async (url, token) => {
    return await getApiResponse(url, 'GET', null, token);
}

export const fetchUserById = async (userId, token) => {
    return await getApiResponse(USER_PATH + `/${userId}`, 'GET', null, token);
}

export const fetchUsersByQuery = async (url, queryText, token) => {
    return await getApiResponse(url + `/search?query=${queryText}`, 'GET', null, token);
}