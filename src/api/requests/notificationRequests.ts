import { NOTIFICATION_PATH } from "../../constants/apiPath";
import { getWrappedApiResponse } from "./fetchApiUtils";
import { JwtToken, ResId } from "../schemas/inferred/common";
import { Notification, NotificationPage } from "../schemas/inferred/notification";
import { ReactionType } from "../schemas/inferred/reaction";


export const fetchNotifications = async (token: JwtToken): Promise<NotificationPage> => (
    await getWrappedApiResponse(NOTIFICATION_PATH, 'GET', null, token)
).json();

export const fetchNotificationsByType = async (type: ReactionType, token: JwtToken): Promise<NotificationPage> => (
    await getWrappedApiResponse(NOTIFICATION_PATH + `/tpye/${type}`, 'GET', null, token)
).json();

export const fetchCountOfPendingNotifications = async (token: JwtToken): Promise<number> => (
    await getWrappedApiResponse(NOTIFICATION_PATH + "/count-pending", 'GET', null, token)
).json();

export const fetchSeenNotification = async (contentId: ResId, token: JwtToken): Promise<Notification> => (
    await getWrappedApiResponse(NOTIFICATION_PATH + `/seen/${contentId}`, 'POST', null, token)
).json();