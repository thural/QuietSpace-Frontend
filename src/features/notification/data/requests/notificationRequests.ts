import {NOTIFICATION_PATH} from "@shared/constants/apiPath";
import {apiClient} from "@core/network/rest/apiClient";
import {JwtToken, ResId} from "@shared/api/models/common";
import {NotificationPage, NotificationResponse} from "@notification/data/models/notification";
import {ReactionType} from "@feed/data/models/reaction";


export const fetchNotifications = async (token: JwtToken, pageParams?: string | undefined): Promise<NotificationPage> => {
    const { data } = await apiClient.get(NOTIFICATION_PATH + (pageParams || ""));
    return data;
};

export const fetchNotificationsByType = async (type: ReactionType, token: JwtToken, pageParams?: string | undefined): Promise<NotificationPage> => {
    const { data } = await apiClient.get(NOTIFICATION_PATH + `/tpye/${type}` + (pageParams || ""));
    return data;
};

export const fetchCountOfPendingNotifications = async (token: JwtToken): Promise<number> => {
    const { data } = await apiClient.get(NOTIFICATION_PATH + "/count-pending");
    return data;
};

export const fetchSeenNotification = async (contentId: ResId, token: JwtToken): Promise<NotificationResponse> => {
    const { data } = await apiClient.post(NOTIFICATION_PATH + `/seen/${contentId}`);
    return data;
};