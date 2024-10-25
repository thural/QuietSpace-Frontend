import { z } from "zod";

export const StompMessageSchema = z.object({
    headers: z.record(z.string()),
    body: z.string(),
});