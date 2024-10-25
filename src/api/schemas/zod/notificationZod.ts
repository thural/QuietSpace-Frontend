import { z } from "zod";
import { PageSchema, ResIdSchema } from "./commonZod";
import { NotificationType } from "../native/notification";

export const NotificationTypeSchema = z.nativeEnum(NotificationType);

export const NotificationSchema = z.object({
    id: ResIdSchema,
    actorId: ResIdSchema,
    contentId: ResIdSchema,
    isSeen: z.boolean(),
    type: z.string(),
    updateDate: z.date()
});

export const NotificationPageSchema = PageSchema(NotificationSchema);