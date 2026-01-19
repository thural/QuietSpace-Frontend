import { NOTIFICATION_PATH } from "@constants/apiPath";
import { getWrappedApiResponse } from "./fetchApiUtils";
import { JwtToken, ResId } from "../schemas/inferred/common";
import { NotificationResponse, NotificationPage } from "../schemas/inferred/notification";
import { ReactionType } from "../schemas/inferred/reaction";


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