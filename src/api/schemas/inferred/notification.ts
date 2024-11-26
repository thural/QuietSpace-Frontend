import { z } from "zod";
import {
    NotificationTypeSchema,
    NotificationSchema,
    NotificationPageSchema,
    NotificationEventSchema
} from "../zod/notificationZod";

export type NotificationEvent = z.infer<typeof NotificationEventSchema>
export type NotificationType = z.infer<typeof NotificationTypeSchema>;
export type NotificationPage = z.infer<typeof NotificationPageSchema>;
export type Notification = z.infer<typeof NotificationSchema>;