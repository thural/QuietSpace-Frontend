import { getApiResponse } from "./commonRequest";

export const fetchMessages = async (url, chatId, token) => {
    try {
        return await getApiResponse(url + `/chat/${chatId}`, 'GET', null, token)
    } catch (error) { throw Error(error.message) }
}

export const fetchCreateMessage = async (url, body, token) => {
    try {
        return await getApiResponse(url, 'POST', body, token);
    } catch (error) { throw Error(error.message) }
}

export const fetchDeleteMessage = async (url, token, messageId) => {
    try {
        return await getApiResponse(url + `/${messageId}`, 'DELETE', null, token);
    } catch (error) { throw Error(error.message) }
}