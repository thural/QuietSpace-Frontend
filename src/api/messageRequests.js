import { getApiResponse } from "./commonRequest";

export const fetchMessages = async (url, chatId, token) => {
    try {
        return await getApiResponse(url + `/chat/${chatId}`, 'GET', null, token)
    } catch (err) { console.log(err) }
}

export const fetchCreateMessage = async (url, body, token) => {
    try {
        return await getApiResponse(url, 'POST', body, token);
    } catch (err) { console.log(err) }
}

export const fetchDeleteMessage = async (url, token, messageId) => {
    try {
        return await getApiResponse(url + `/${messageId}`, 'DELETE', null, token);
    } catch (err) { console.log(err) }
}