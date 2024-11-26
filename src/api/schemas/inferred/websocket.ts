import { z } from "zod";
import { BaseEventSchema, SocketEventTypeSchema, StompMessageSchema } from "../zod/websocket";

export type StompMessage = z.infer<typeof StompMessageSchema>;
export type SocketEventType = z.infer<typeof SocketEventTypeSchema>;
export type BaseEvent = z.infer<typeof BaseEventSchema>;