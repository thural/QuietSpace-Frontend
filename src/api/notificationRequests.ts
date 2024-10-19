import { NOTIFICATION_PATH } from "../constants/ApiPath";
import { getApiResponse } from "./commonRequest";

export const fetchNotifications = async (token) => {
    try {
        return await getApiResponse(NOTIFICATION_PATH, 'GET', null, token);
    } catch (error) { throw new Error(error.message) }
}

export const fetchNotificationsByType = async (type, token) => {
    try {
        return await getApiResponse(NOTIFICATION_PATH + `/tpye/${type}`, 'GET', null, token);
    } catch (error) { throw new Error(error.message) }
}

export const fetchCountOfPendingNotifications = async (token) => {
    try {
        return await getApiResponse(NOTIFICATION_PATH + "/count-pending", 'GET', null, token);
    } catch (error) { throw new Error(error.message) }
}

export const fetchSeenNotification = async (contentId, token) => {
    try {
        return await getApiResponse(NOTIFICATION_PATH + `/seen/${contentId}`, 'POST', null, token);
    } catch (error) { throw new Error(error.message) }
}