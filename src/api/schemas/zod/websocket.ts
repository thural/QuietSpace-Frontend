import { z } from "zod";
import { SocketEventType } from "../native/websocket";

export const StompMessageSchema = z.object({
    headers: z.record(z.string()),
    body: z.string(),
});

export const SocketEventTypeSchema = z.nativeEnum(SocketEventType);

export const BaseEventSchema = z.object({
    message: z.string().optional(),
    eventBody: z.record(z.any()).optional(),
    type: SocketEventTypeSchema
});