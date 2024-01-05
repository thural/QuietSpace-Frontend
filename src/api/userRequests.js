import {getApiResponse} from "./commonRequest";

export const fetchUser = async (url, token) => {
    try {
        const response = await getApiResponse(url, 'GET', null, token);
        return response;
    } catch (err) { console.log(err) }
}