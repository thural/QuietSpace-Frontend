import {getApiResponse} from "./commonRequest";

export const fetchChats = async (url, userId, token) => {
    try {
        return await getApiResponse(url + `/${userId}`, 'GET', null, token);
    } catch (err) { console.log(err) }
}

export const fetchChatById = async (url, token) => {
    try {
        return await getApiResponse(url, 'GET', null, token);
    } catch (err) { console.log(err) }
}

export const fetchCreateChat = async (url, body, token) => {
    try {
        return await getApiResponse(url, 'POST', body, token);
    } catch (err) { console.log(err) }
}

export const fetchAddMemberWithId = async (url, token) => {
    try {
        return await getApiResponse(url, 'PATCH', null, token);
    } catch (err) { console.log(err) }
}

export const fetchDeleteChat = async (url, chatId, token) => {
    try {
        return await getApiResponse(url + `/${chatId}`, 'DELETE', null, token);
    } catch (err) { console.log(err) }
}