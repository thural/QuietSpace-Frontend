import {getApiResponse} from "./commonRequest";
import {FOLLOW_PATH, USER_PATH} from "../constants/ApiPath";

export const fetchUser = async (url, token) => {
    return await getApiResponse(url, 'GET', null, token);
}

export const fetchUserById = async (userId, token) => {
    return await getApiResponse(USER_PATH + `/${userId}`, 'GET', null, token);
}

export const fetchUsersByQuery = async (url, queryText, token) => {
    return await getApiResponse(url + `/search?query=${queryText}`, 'GET', null, token);
}

export const fetchToggleFollow = async (userId, token) => {
    return await getApiResponse(FOLLOW_PATH + `/${userId}/toggle-follow`, 'POST', null, token);
}

export const fetchFollowers = async (token) => {
    return await getApiResponse(FOLLOW_PATH + `/followers`, 'GET', null, token);
}