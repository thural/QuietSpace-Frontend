import { z } from "zod";
import {
    NotificationTypeSchema,
    NotificationSchema,
    PagedNotificationResponseSchema
} from "../zod/notificationZod";

export type NotificationType = z.infer<typeof NotificationTypeSchema>;
export type NotificationSchema = z.infer<typeof NotificationSchema>;
export type PagedNotificationResponse = z.infer<typeof PagedNotificationResponseSchema>;