import {getApiResponse} from "./commonRequest";

export const fetchUser = async (url, token) => {
    try {
        return await getApiResponse(url, 'GET', null, token);
    } catch (err) { console.log(err) }
}