import { z } from "zod";
import { PageSchema, ResIdSchema } from "./commonZod";
import { NotificationType } from "../native/notification";
import { BaseEventSchema } from "./websocket";

export const NotificationTypeSchema = z.nativeEnum(NotificationType);

export const NotificationSchema = z.object({
    id: ResIdSchema,
    actorId: ResIdSchema,
    contentId: ResIdSchema,
    isSeen: z.boolean(),
    type: z.string(),
    updateDate: z.date()
});

export const NotificationEventSchema = BaseEventSchema.extend({
    actorId: ResIdSchema,
    notificationId: ResIdSchema,
    recipientId: ResIdSchema
});

export const NotificationPageSchema = PageSchema(NotificationSchema);