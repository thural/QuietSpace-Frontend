import type {AxiosInstance} from 'axios';
import {Inject, Injectable} from '@/core/di';
import {TYPES} from '@/core/di/types';
import {NOTIFICATION_PATH} from "@/shared/constants/apiPath";
import {ResId} from "@/shared/api/models/common";
import {NotificationPage, NotificationResponse} from "@/features/notification/data/models/notification";
import {ReactionType} from "@/features/feed/data/models/reaction";

/**
 * Notification Repository - Handles notification-related API operations
 */
@Injectable()
export class NotificationRepository {
    constructor(@Inject(TYPES.API_CLIENT) private apiClient: AxiosInstance) {}

    async getNotifications(pageParams?: string): Promise<NotificationPage> {
        const { data } = await this.apiClient.get(NOTIFICATION_PATH + (pageParams || ""));
        return data;
    }

    async getNotificationsByType(type: ReactionType, pageParams?: string): Promise<NotificationPage> {
        const { data } = await this.apiClient.get(NOTIFICATION_PATH + `/type/${type}` + (pageParams || ""));
        return data;
    }

    async getCountOfPendingNotifications(): Promise<number> {
        const { data } = await this.apiClient.get(NOTIFICATION_PATH + "/count-pending");
        return data;
    }

    async seenNotification(contentId: ResId): Promise<NotificationResponse> {
        const { data } = await this.apiClient.post(NOTIFICATION_PATH + `/seen/${contentId}`);
        return data;
    }
}
