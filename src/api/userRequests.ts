import { USER_PATH } from "../constants/ApiPath";
import { getApiResponse } from "./commonRequest";
import { PagedUserResponse } from "./schemas/user";

export const fetchUser = async (url: string, token: string) => {
    try {
        return await getApiResponse(url, 'GET', null, token);
    } catch (error) { throw new Error(error.message) }
}

export const fetchUserById = async (userId: string, token: string) => {
    try {
        return await getApiResponse(USER_PATH + `/${userId}`, 'GET', null, token);
    } catch (error) { throw new Error(error.message) }
}

export const fetchUsersByQuery = async (queryText: string, token: string): Promise<PagedUserResponse> => {
    interface CustomError extends Error {
        statusCode?: number;
    }
    try {
        const response = await getApiResponse(USER_PATH + `/search?username=${queryText}`, 'GET', null, token);
        return await response.json() as PagedUserResponse;
    } catch (error: unknown) {
        const customError: CustomError = new Error((error as Error).message);
        customError.statusCode = (error as any).statusCode;
        throw customError
    }
}

export const fetchToggleFollow = async (userId: string, token: string) => {
    try {
        return await getApiResponse(USER_PATH + `/follow/${userId}/toggle-follow`, 'POST', null, token);
    } catch (error) { throw new Error(error.message) }
}

export const fetchFollowers = async (userId: string, token: string) => {
    try {
        return await getApiResponse(USER_PATH + `/${userId}/followers`, 'GET', null, token);
    } catch (error) { throw new Error(error.message) }
}

export const fetchFollowings = async (userId: string, token: string) => {
    try {
        return await getApiResponse(USER_PATH + `/${userId}/followings`, 'GET', null, token);
    } catch (error) { throw new Error(error.message) }
}

export const fetchRemoveFollower = async (token: string, userId: string) => {
    try {
        return await getApiResponse(USER_PATH + `followers/remove/${userId}`, 'POST', null, token);
    } catch (error) { throw new Error(error.message) }
}