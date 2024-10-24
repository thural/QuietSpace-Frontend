import { z } from "zod";
import { BaseSchemaZod, ContentResponseSchema, PagedResponseSchema, ResIdSchema } from "./commonZod";
import { UserSchema } from "./userZod";
import { ChatEventType } from "@/api/schemas/native/chat";

export const ChatEventTypeSchema = z.nativeEnum(ChatEventType);

export const BaseEventSchema = z.object({
    message: z.string(),
    eventBody: z.object({}),
    type: ChatEventTypeSchema
});

export const ChatEventSchema = BaseEventSchema.extend({
    chatId: ResIdSchema,
    actorId: ResIdSchema,
    messageId: ResIdSchema,
    recipientId: ResIdSchema
});

export const MessageBodySchema = z.object({
    chatId: ResIdSchema,
    senderId: ResIdSchema,
    recipientId: ResIdSchema,
    text: z.string()
});

export const MessageSchema = MessageBodySchema.extend({
    ...BaseSchemaZod.shape,
    senderName: z.string(),
    isSeen: z.boolean()
});

export const ChatSchema = BaseSchemaZod.extend({
    userIds: z.array(ResIdSchema),
    members: z.array(UserSchema),
    recentMessage: MessageSchema
});

export const AtLeastTwoElemsSchema = <T extends z.ZodType>(schema: T) =>
    z.array(schema).refine((arr) => arr.length >= 2, {
        message: "array must contain at least two elements"
    });

export const CreateChatRequestSchema = z.object({
    isGroupChat: z.boolean(),
    userIds: AtLeastTwoElemsSchema(ResIdSchema),
    recipientId: ResIdSchema,
    text: z.string()
});

export const MessageListResponseSchema = ContentResponseSchema(MessageSchema);
export const PagedMessageResponseSchema = PagedResponseSchema(MessageSchema);
export const ChatResponseListSchema = ContentResponseSchema(ChatSchema);