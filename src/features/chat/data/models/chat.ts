import { z } from "zod";
import {
    AtLeastTwoElemSchema,
    ChatEventSchema,
    ChatListSchema,
    ChatResponseSchema,
    CreateChatSchema,
    MessageRequestSchema,
    MessageListSchema,
    MessagePageSchema,
    MessageResponseSchema
} from "./chatZod";


export type ChatEvent = z.infer<typeof ChatEventSchema>;
export type MessageRequest = z.infer<typeof MessageRequestSchema>;
export type MessageResponse = z.infer<typeof MessageResponseSchema>;
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
export type CreateChatRequest = z.infer<typeof CreateChatSchema>;
export type MessageList = z.infer<typeof MessageListSchema>;
export type PagedMessage = z.infer<typeof MessagePageSchema>;
export type ChatList = z.infer<typeof ChatListSchema>;

export type AtLeastTwoElems<T> = z.infer<ReturnType<typeof AtLeastTwoElemSchema<z.ZodType<T>>>>;