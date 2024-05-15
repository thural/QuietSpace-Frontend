import { getApiResponse } from "./commonRequest";

export const fetchMessages = async (url, chatId, token) => {
    return await getApiResponse(url + `/chat/${chatId}`, 'GET', null, token)
}

export const fetchCreateMessage = async (url, body, token) => {
    return await getApiResponse(url, 'POST', body, token);
}

export const fetchDeleteMessage = async (url, token, messageId) => {
    return await getApiResponse(url + `/${messageId}`, 'DELETE', null, token);
}