import { z } from "zod";
import {
    ChatEventTypeSchema,
    BaseEventSchema,
    ChatEventSchema,
    MessageBodySchema,
    MessageSchema,
    ChatSchema,
    CreateChatRequestSchema,
    MessageListResponseSchema,
    PagedMessageResponseSchema,
    ChatResponseListSchema,
    AtLeastTwoElemsSchema
} from "../zod/chatZod";

export type ChatEventType = z.infer<typeof ChatEventTypeSchema>;
export type BaseEvent = z.infer<typeof BaseEventSchema>;
export type ChatEvent = z.infer<typeof ChatEventSchema>;
export type MessageBody = z.infer<typeof MessageBodySchema>;
export type MessageSchema = z.infer<typeof MessageSchema>;
export type ChatSchema = z.infer<typeof ChatSchema>;
export type CreateChatRequest = z.infer<typeof CreateChatRequestSchema>;
export type MessageListResponse = z.infer<typeof MessageListResponseSchema>;
export type PagedMessageResponse = z.infer<typeof PagedMessageResponseSchema>;
export type ChatResponseList = z.infer<typeof ChatResponseListSchema>;

export type AtLeastTwoElems<T> = z.infer<ReturnType<typeof AtLeastTwoElemsSchema<z.ZodType<T>>>>;