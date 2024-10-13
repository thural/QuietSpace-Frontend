import { USER_PATH } from "../constants/ApiPath";
import { getApiResponse } from "./commonRequest";

export const fetchUser = async (url, token) => {
    try {
        return await getApiResponse(url, 'GET', null, token);
    } catch (error) { throw new Error(error.message) }
}

export const fetchUserById = async (userId, token) => {
    try {
        return await getApiResponse(USER_PATH + `${userId}`, 'GET', null, token);
    } catch (error) { throw new Error(error.message) }
}

export const fetchUsersByQuery = async (queryText, token) => {
    try {
        return await getApiResponse(USER_PATH + `/search?query=${queryText}`, 'GET', null, token);
    } catch (error) { throw new Error(error.message) }
}

export const fetchToggleFollow = async (userId, token) => {
    try {
        return await getApiResponse(USER_PATH + `/follow/${userId}/toggle-follow`, 'POST', null, token);
    } catch (error) { throw new Error(error.message) }
}

export const fetchFollowers = async (token) => {
    try {
        return await getApiResponse(USER_PATH + `/followers`, 'GET', null, token);
    } catch (error) { throw new Error(error.message) }
}

export const fetchFollowings = async (token) => {
    try {
        return await getApiResponse(USER_PATH + `/followings`, 'GET', null, token);
    } catch (error) { throw new Error(error.message) }
}

export const fetchRemoveFollower = async (token, userId) => {
    try {
        return await getApiResponse(USER_PATH + `followers/remove/${userId}`, 'POST', null, token);
    } catch (error) { throw new Error(error.message) }
}