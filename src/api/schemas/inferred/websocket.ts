import { z } from "zod";
import { StompMessageSchema } from "../zod/websocket";

export type StompMessage = z.infer<typeof StompMessageSchema>;