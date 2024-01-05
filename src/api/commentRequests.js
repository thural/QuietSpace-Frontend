import {getApiResponse} from "./commonRequest";


export const fetchCreateComment = async (url, body, token) => {
    try {
        const response = await getApiResponse(url, 'POST', body, token);
        return response;
    } catch (err) { console.log(err) }
}