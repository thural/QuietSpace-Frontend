import { z } from "zod";
import { BaseSchema, PageContentSchema, PageSchema, ResIdSchema } from "./commonZod";
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
    ...BaseSchema.shape,
    senderName: z.string(),
    isSeen: z.boolean()
});

export const ChatSchema = BaseSchema.extend({
    userIds: z.array(ResIdSchema),
    members: z.array(UserSchema),
    recentMessage: MessageSchema
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

export const MessageListSchema = PageContentSchema(MessageSchema);
export const MessagePageSchema = PageSchema(MessageSchema);
export const ChatListSchema = PageContentSchema(ChatSchema);