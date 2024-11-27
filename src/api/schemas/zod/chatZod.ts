import { z } from "zod";
import { BaseSchema, PageContentSchema, PageSchema, ResIdSchema } from "./commonZod";
import { UserResponseSchema } from "./userZod";
import { BaseEventSchema } from "./websocket";
import { PhotoResponseSchema } from "./photoZod";


export const ChatEventSchema = BaseEventSchema.extend({
    chatId: ResIdSchema,
    actorId: ResIdSchema.optional(),
    messageId: ResIdSchema.optional(),
    recipientId: ResIdSchema.optional()
});

export const MessageRequestSchema = z.object({
    chatId: ResIdSchema,
    senderId: ResIdSchema,
    recipientId: ResIdSchema,
    photoData: z.any().optional(),
    text: z.string()
});

export const MessageResponseSchema = MessageRequestSchema.extend({
    ...BaseSchema.shape,
    senderName: z.string(),
    isSeen: z.boolean(),
    photo: PhotoResponseSchema.optional(),
});

export const ChatResponseSchema = BaseSchema.extend({
    userIds: z.array(ResIdSchema),
    members: z.array(UserResponseSchema),
    recentMessage: MessageResponseSchema.optional()
});

export const AtLeastTwoElemSchema = <T extends z.ZodType>(schema: T) =>
    z.array(schema).refine((arr) => arr.length >= 2, {
        message: "array must contain at least two elements"
    });

export const CreateChatSchema = z.object({
    isGroupChat: z.boolean(),
    userIds: AtLeastTwoElemSchema(ResIdSchema),
    recipientId: ResIdSchema,
    text: z.string()
});

export const MessageListSchema = PageContentSchema(MessageResponseSchema);
export const MessagePageSchema = PageSchema(MessageResponseSchema);
export const ChatListSchema = PageContentSchema(ChatResponseSchema);