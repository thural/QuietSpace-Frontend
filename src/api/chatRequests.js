import {getApiResponse} from "./commonRequest";

export const fetchChats = async (url, userId, token) => {
    return await getApiResponse(url + `/${userId}`, 'GET', null, token);
}

export const fetchChatById = async (url, token) => {
    return await getApiResponse(url, 'GET', null, token);
}

export const fetchCreateChat = async (url, body, token) => {
    return await getApiResponse(url, 'POST', body, token);
}

export const fetchAddMemberWithId = async (url, token) => {
    return await getApiResponse(url, 'PATCH', null, token);
}

export const fetchDeleteChat = async (url, chatId, token) => {
    return await getApiResponse(url + `/${chatId}`, 'DELETE', null, token);
}