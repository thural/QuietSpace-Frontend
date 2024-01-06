import {getApiResponse} from "./commonRequest";


export const fetchCreateComment = async (url, body, token) => {
    try {
        return await getApiResponse(url, 'POST', body, token);
    } catch (err) { console.log(err) }
}

export const fetchDeleteComment = async (url, token) => {
    try {
        return await getApiResponse(url, 'DELETE', null, token);
    } catch (error) {console.log(error)}
}