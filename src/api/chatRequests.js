import { CHAT_PATH, CHAT_PATH_BY_MEMBER } from "../constants/ApiPath";
import { getApiResponse } from "./commonRequest";

export const fetchChats = async (userId, token) => {
    try {
        return await getApiResponse(CHAT_PATH_BY_MEMBER + `/${userId}`, 'GET', null, token);
    } catch (error) { throw Error(error.message) }
}

export const fetchChatById = async (url, token) => {
    try {
        return await getApiResponse(url, 'GET', null, token);
    } catch (error) { throw Error(error.message) }
}

export const fetchCreateChat = async (url, body, token) => {
    try {
        return await getApiResponse(url, 'POST', body, token);
    } catch (error) { throw Error(error.message) }
}

export const fetchAddMemberWithId = async (url, token) => {
    try {
        return await getApiResponse(url, 'PATCH', null, token);
    } catch (error) { throw Error(error.message) }
}

export const fetchDeleteChat = async (chatId, token) => {
    try {
        return await getApiResponse(CHAT_PATH + `/${chatId}`, 'DELETE', null, token);
    } catch (error) { throw Error(error.message) }
}