import { z } from "zod";
import {
    NotificationTypeSchema,
    NotificationSchema,
    NotificationPageSchema
} from "../zod/notificationZod";

export type NotificationType = z.infer<typeof NotificationTypeSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
export type NotificationPage = z.infer<typeof NotificationPageSchema>;