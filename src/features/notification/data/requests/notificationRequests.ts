import { NOTIFICATION_PATH } from "../../../../shared/constants/apiPath";
import { getWrappedApiResponse } from "../../../../core/network/rest/fetchApiClient";
import { JwtToken, ResId } from "../../../../shared/api/models/common";
import { NotificationResponse, NotificationPage } from "../../../notification/data/models/notification";
import { ReactionType } from "../../../feed/data/models/reaction";


export const fetchNotifications = async (token: JwtToken, pageParams?: string | undefined): Promise<NotificationPage> => (
    await getWrappedApiResponse(NOTIFICATION_PATH + (pageParams || ""), 'GET', null, token)
).json();

export const fetchNotificationsByType = async (type: ReactionType, token: JwtToken, pageParams?: string | undefined): Promise<NotificationPage> => (
    await getWrappedApiResponse(NOTIFICATION_PATH + `/tpye/${type}` + (pageParams || ""), 'GET', null, token)
).json();

export const fetchCountOfPendingNotifications = async (token: JwtToken): Promise<number> => (
    await getWrappedApiResponse(NOTIFICATION_PATH + "/count-pending", 'GET', null, token)
).json();

export const fetchSeenNotification = async (contentId: ResId, token: JwtToken): Promise<NotificationResponse> => (
    await getWrappedApiResponse(NOTIFICATION_PATH + `/seen/${contentId}`, 'POST', null, token)
).json();