import { z } from "zod";
import {
    NotificationTypeSchema,
    NotificationResponseSchema,
    NotificationPageSchema,
    NotificationEventSchema
} from "../zod/notificationZod";

export type NotificationEvent = z.infer<typeof NotificationEventSchema>
export type NotificationType = z.infer<typeof NotificationTypeSchema>;
export type NotificationPage = z.infer<typeof NotificationPageSchema>;
export type NotificationResponse = z.infer<typeof NotificationResponseSchema>;