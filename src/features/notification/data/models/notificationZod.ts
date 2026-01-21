import { z } from "zod";
import { BaseSchema, PageSchema, ResIdSchema } from "./commonZod";
import { NotificationType } from "../native/notification";
import { BaseEventSchema } from "./websocket";

export const NotificationTypeSchema = z.nativeEnum(NotificationType);

export const NotificationResponseSchema = BaseSchema.extend({
    actorId: ResIdSchema,
    contentId: ResIdSchema,
    isSeen: z.boolean(),
    type: z.string(),
});

export const NotificationEventSchema = BaseEventSchema.extend({
    actorId: ResIdSchema,
    notificationId: ResIdSchema,
    recipientId: ResIdSchema
});

export const NotificationPageSchema = PageSchema(NotificationResponseSchema);