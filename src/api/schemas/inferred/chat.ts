import { z } from "zod";
import {
    ChatEventTypeSchema,
    BaseEventSchema,
    ChatEventSchema,
    MessageBodySchema,
    MessageSchema,
    ChatSchema,
    CreateChatSchema,
    MessageListSchema,
    MessagePageSchema,
    ChatListSchema,
    AtLeastTwoElemSchema
} from "../zod/chatZod";

export type ChatEventType = z.infer<typeof ChatEventTypeSchema>;
export type BaseEvent = z.infer<typeof BaseEventSchema>;
export type ChatEvent = z.infer<typeof ChatEventSchema>;
export type MessageBody = z.infer<typeof MessageBodySchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Chat = z.infer<typeof ChatSchema>;
export type CreateChat = z.infer<typeof CreateChatSchema>;
export type MessageList = z.infer<typeof MessageListSchema>;
export type PagedMessage = z.infer<typeof MessagePageSchema>;
export type ChatList = z.infer<typeof ChatListSchema>;

export type AtLeastTwoElems<T> = z.infer<ReturnType<typeof AtLeastTwoElemSchema<z.ZodType<T>>>>;