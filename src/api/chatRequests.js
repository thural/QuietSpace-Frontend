import {getApiResponse} from "./commonRequest";

export const fetchChats = async (url, userId, token) => {
    try {
        return await getApiResponse(url + `/${userId}`, 'GET', null, token);
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

export const fetchDeleteChat = async (url, chatId, token) => {
    try {
        return await getApiResponse(url + `/${chatId}`, 'DELETE', null, token);
    } catch (error) { throw Error(error.message) }
}