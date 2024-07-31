import { FOLLOW_PATH, USER_PATH } from "../constants/ApiPath";
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

export const fetchToggleFollow = async (userId, token) => {
    try {
        return await getApiResponse(USER_PATH + `/follow/${userId}/toggle-follow`, 'POST', null, token);
    } catch (error) { throw Error(error.message) }
}

export const fetchFollowers = async (token) => {
    try {
        return await getApiResponse(USER_PATH + `/followers`, 'GET', null, token);
    } catch (error) { throw Error(error.message) }
}

export const fetchFollowings = async (token) => {
    try {
        return await getApiResponse(USER_PATH + `/followings`, 'GET', null, token);
    } catch (error) { throw Error(error.message) }
}