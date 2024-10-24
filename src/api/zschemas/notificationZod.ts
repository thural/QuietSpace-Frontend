import { z } from "zod";
import { PagedResponseSchema, ResIdSchema } from "./commonZod";
import { NotificationType } from "../schemas/notification";

export const NotificationTypeSchema = z.nativeEnum(NotificationType);

export const NotificationSchema = z.object({
    id: ResIdSchema,
    actorId: ResIdSchema,
    contentId: ResIdSchema,
    isSeen: z.boolean(),
    type: z.string(),
    updateDate: z.date()
});

export const PagedNotificationResponseSchema = PagedResponseSchema(NotificationSchema);